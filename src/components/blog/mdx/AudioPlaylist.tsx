'use client'

import type { FC } from 'react'
import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid'
import { useEffect, useMemo, useRef, useState, useId, useCallback } from 'react'
import type { Track } from './AudioPlayer'

type AudioPlaylistProps = {
  heading?: string
  tracks?: Track[]
}

const isTrack = (value: unknown): value is Track => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { src?: unknown }).src === 'string'
  )
}

const formatTime = (value: number) => {
  if (!isFinite(value) || value < 0) return '0:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export const AudioPlaylist: FC<AudioPlaylistProps> = ({
  heading,
  tracks = [],
}) => {
  const normalized = useMemo(() => normalizeTracks(tracks), [tracks])
  const playlistKey = useMemo(
    () => normalized.map((track) => track.src).join('|'),
    [normalized]
  )
  const playlistId = useId()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [durations, setDurations] = useState<Array<number | undefined>>(() =>
    new Array(normalized.length).fill(undefined)
  )

  const audioRef = useRef<HTMLAudioElement | null>(null)
  // Always-fresh ref so event handlers never capture stale state
  const stateRef = useRef({ currentIndex, normalized, playlistId })
  useEffect(() => {
    stateRef.current = { currentIndex, normalized, playlistId }
  }, [currentIndex, normalized, playlistId])

  // Imperatively load a track and optionally start playback
  const loadTrack = useCallback((index: number, play: boolean) => {
    const audio = audioRef.current
    const track = stateRef.current.normalized[index]
    if (!audio || !track) return
    audio.src = track.src
    audio.load()
    audio.currentTime = 0
    setCurrentIndex(index)
    setCurrentTime(0)
    if (play) {
      audio.play().catch(() => setIsPlaying(false))
    }
  }, [])

  // Pre-load track durations for the playlist display
  useEffect(() => {
    if (!normalized.length) return
    let cancelled = false
    const loaders = normalized.map((track, index) => {
      const audio = new Audio()
      const handleLoaded = () => {
        if (cancelled) return
        const value = isFinite(audio.duration) ? audio.duration : 0
        setDurations((prev) => {
          const next =
            prev.length === normalized.length
              ? [...prev]
              : new Array(normalized.length).fill(undefined)
          next[index] = value
          return next
        })
      }
      audio.addEventListener('loadedmetadata', handleLoaded)
      audio.src = track.src
      audio.load()
      return { audio, handleLoaded }
    })
    return () => {
      cancelled = true
      loaders.forEach(({ audio, handleLoaded }) => {
        audio.removeEventListener('loadedmetadata', handleLoaded)
        audio.src = ''
        audio.load()
      })
    }
  }, [normalized])

  // Set up audio element event listeners once (stateRef keeps values fresh)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      const { currentIndex, normalized } = stateRef.current
      if (currentIndex < normalized.length - 1) {
        loadTrack(currentIndex + 1, true)
      } else {
        setIsPlaying(false)
      }
    }
    const handlePlay = () => {
      setIsPlaying(true)
      window.dispatchEvent(
        new CustomEvent('audio-playlist-play', {
          detail: { id: stateRef.current.playlistId },
        })
      )
    }
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0)
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0)
      setCurrentTime(audio.currentTime || 0)
    }

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [loadTrack])

  // Pause when another playlist on the page starts playing
  useEffect(() => {
    const handleExternalPlay = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail
      if (!detail || detail.id === stateRef.current.playlistId) return
      audioRef.current?.pause()
    }
    window.addEventListener('audio-playlist-play', handleExternalPlay)
    return () =>
      window.removeEventListener('audio-playlist-play', handleExternalPlay)
  }, [])

  if (!normalized.length) {
    return (
      <section className='my-6 rounded-lg border border-(--border) bg-(--surface) p-4 text-sm text-(--muted) shadow-sm'>
        <p className='font-semibold text-foreground'>{heading ?? 'Playlist'}</p>
        <p>Keine Tracks gefunden.</p>
      </section>
    )
  }

  const currentTrack = normalized[currentIndex]

  const handleSelect = (index: number) => loadTrack(index, true)

  const handlePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.src) {
      const track = normalized[currentIndex]
      if (track) {
        audio.src = track.src
        audio.load()
      }
    }
    audio.play().catch(() => setIsPlaying(false))
  }

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause()
    } else {
      handlePlay()
    }
  }

  const handlePrev = () =>
    handleSelect((currentIndex - 1 + normalized.length) % normalized.length)

  const handleNext = () => handleSelect((currentIndex + 1) % normalized.length)

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = event.currentTarget.getBoundingClientRect()
    const fraction = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / rect.width)
    )
    const seekTime = fraction * duration
    audio.currentTime = seekTime
    setCurrentTime(seekTime)
    if (!isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    }
  }

  const trackDuration =
    durations.length === normalized.length
      ? (durations[currentIndex] ?? duration)
      : duration

  return (
    <section
      key={playlistKey || 'playlist'}
      className='my-6 rounded-lg border border-(--border) bg-(--surface) p-4 shadow-sm'
    >
      {heading ? (
        <h3 className='mb-3 text-lg font-semibold text-foreground'>
          {heading}
        </h3>
      ) : null}

      <div className='mb-3 flex items-center justify-between gap-3 rounded-lg border border-(--border-strong) bg-(--surface-strong) px-3 py-2'>
        <div className='flex min-w-0 flex-wrap items-center gap-2 text-sm text-(--muted)'>
          <span className='min-w-0 flex-1 truncate font-medium text-foreground'>
            {currentTrack?.title ?? currentTrack?.src ?? 'Unbekannter Track'}
          </span>
          <span className='text-[11px] tabular-nums text-(--muted)'>
            {formatTime(trackDuration)}
          </span>
          {isPlaying ? (
            <span className='flex items-center gap-1 text-[11px] font-semibold text-(--accent)'>
              <span
                className='h-2 w-2 animate-pulse rounded-full bg-(--accent)'
                aria-hidden='true'
              />
              Spielt
            </span>
          ) : null}
        </div>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={handlePrev}
            className='cursor-pointer rounded-full border border-(--border) bg-(--surface) px-3 py-1 text-sm font-semibold text-foreground transition hover:bg-(--surface-strong)'
            aria-label='Vorheriger Track'
          >
            ‹
          </button>
          <button
            type='button'
            onClick={handleTogglePlay}
            className={`cursor-pointer rounded-full px-4 py-1 text-sm font-semibold shadow-sm transition ${
              isPlaying
                ? 'border border-(--border) bg-(--surface) text-foreground hover:bg-(--surface-strong)'
                : 'bg-(--accent) text-white hover:opacity-90'
            }`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <PauseIcon className='h-4 w-4' />
            ) : (
              <PlayIcon className='h-4 w-4' />
            )}
          </button>
          <button
            type='button'
            onClick={handleNext}
            className='cursor-pointer rounded-full border border-(--border) bg-(--surface) px-3 py-1 text-sm font-semibold text-foreground transition hover:bg-(--surface-strong)'
            aria-label='Nächster Track'
          >
            ›
          </button>
        </div>
      </div>

      <div
        className='mb-3 cursor-pointer select-none'
        onClick={handleSeek}
        aria-label='Seek in current track'
      >
        <div className='h-2 w-full rounded-full bg-gray-200'>
          <div
            className='h-2 rounded-full bg-(--accent)'
            style={{
              width: duration
                ? `${Math.min(100, (currentTime / duration) * 100)}%`
                : '0%',
            }}
          />
        </div>
        <div className='mt-1 flex justify-between text-[11px] text-(--muted)'>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className='max-h-64 overflow-y-auto rounded-lg border border-(--border-strong) bg-(--surface)'>
        {normalized.map((track, index) => {
          const isActive = index === currentIndex
          return (
            <button
              key={`${track.src}-${track.title ?? 'track'}`}
              type='button'
              onClick={() => handleSelect(index)}
              className={`flex w-full cursor-pointer items-center justify-between gap-1.5 px-3 py-1.5 text-left text-sm transition ${
                isActive
                  ? 'bg-gray-100 text-foreground'
                  : 'text-(--muted) hover:bg-(--surface-strong)'
              } ${index < normalized.length - 1 ? 'border-b border-(--border)' : ''}`}
            >
              <span className='truncate'>{track.title ?? track.src}</span>
              <span className='flex items-center gap-2 text-[11px] text-(--muted)'>
                <span
                  className={isActive ? 'font-semibold text-(--accent)' : ''}
                >
                  {isActive
                    ? isPlaying
                      ? 'Spielend'
                      : 'Pausiert'
                    : 'Tippen zum Abspielen'}
                </span>
                <span className='tabular-nums'>
                  {formatTime(durations[index] ?? 0)}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <audio ref={audioRef} preload='none' className='hidden' />
    </section>
  )
}

const safeParseTracks = (value: string): Track[] => {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter(isTrack) : []
  } catch (error) {
    console.warn('AudioPlaylist: could not parse tracks string', error)
    return []
  }
}

const normalizeTracks = (value: unknown): Track[] => {
  if (Array.isArray(value)) {
    return value.filter(isTrack)
  }

  if (typeof value === 'string') {
    return safeParseTracks(value)
  }

  if (value && typeof value === 'object') {
    const entries = Object.values(value as Record<string, unknown>)
    return entries.filter(isTrack)
  }

  return []
}
