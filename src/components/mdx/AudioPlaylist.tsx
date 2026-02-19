'use client'

import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid'
import { useEffect, useMemo, useRef, useState, useId } from 'react'

type Track = {
  src: string
  title?: string
}

type AudioPlaylistProps = {
  heading?: string
  tracks?: Track[]
}

function formatTime(value: number) {
  if (!isFinite(value) || value < 0) return '0:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function AudioPlaylist({ heading, tracks = [] }: AudioPlaylistProps) {
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

  const clampedIndex = useMemo(() => {
    if (!normalized.length) return 0
    return Math.min(currentIndex, normalized.length - 1)
  }, [currentIndex, normalized.length])

  const displayDurations = useMemo(() => {
    if (!normalized.length) return []
    if (durations.length === normalized.length) return durations
    const next = new Array(normalized.length).fill(undefined)
    for (let i = 0; i < Math.min(durations.length, normalized.length); i++) {
      next[i] = durations[i]
    }
    return next
  }, [durations, normalized.length])

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

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !normalized.length) return
    const current = normalized[clampedIndex]
    if (!current) return

    if (audio.src !== current.src) {
      audio.src = current.src
      audio.load()
      audio.currentTime = 0
    }
  }, [clampedIndex, normalized])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      setCurrentIndex((prev) => {
        if (prev < normalized.length - 1) {
          setIsPlaying(true)
          return prev + 1
        }
        setIsPlaying(false)
        return prev
      })
    }
    const handlePlay = () => {
      setIsPlaying(true)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('audio-playlist-play', { detail: { id: playlistId } })
        )
      }
    }
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0)
    const handleLoaded = () => {
      setDuration(audio.duration || 0)
      setCurrentTime(audio.currentTime || 0)
    }

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoaded)

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoaded)
    }
  }, [playlistId, normalized.length])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleExternalPlay = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail
      if (!detail || detail.id === playlistId) return
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }

    window.addEventListener('audio-playlist-play', handleExternalPlay)
    return () =>
      window.removeEventListener('audio-playlist-play', handleExternalPlay)
  }, [playlistId])

  if (!normalized.length) {
    return (
      <section className='my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-sm text-[color:var(--muted)] shadow-sm'>
        <p className='font-semibold text-[color:var(--foreground)]'>
          {heading ?? 'Playlist'}
        </p>
        <p>Keine Tracks gefunden.</p>
      </section>
    )
  }

  const currentTrack = normalized[clampedIndex]

  const handleSelect = (index: number) => {
    setCurrentIndex(index)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const handlePlayCurrent = () => {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.src && normalized[clampedIndex]) {
      audio.src = normalized[clampedIndex]?.src ?? ''
      audio.load()
    }
    audio.play().catch(() => setIsPlaying(false))
    setIsPlaying(true)
  }

  const handlePauseAll = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setIsPlaying(false)
  }

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return
    const rect = event.currentTarget.getBoundingClientRect()
    const offset = event.clientX - rect.left
    const fraction = Math.max(0, Math.min(1, offset / rect.width))
    audioRef.current.currentTime = fraction * duration
    setCurrentTime(audioRef.current.currentTime)
    if (!isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false))
      setIsPlaying(true)
    }
  }

  return (
    <section
      key={playlistKey || 'playlist'}
      className='my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm'
    >
      {heading ? (
        <h3 className='mb-3 text-lg font-semibold text-[color:var(--foreground)]'>
          {heading}
        </h3>
      ) : null}

      <div className='mb-3 flex items-center justify-between gap-3 rounded-lg border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] px-3 py-2'>
        <div className='flex min-w-0 flex-wrap items-center gap-2 text-sm text-[color:var(--muted)]'>
          <span className='min-w-0 flex-1 truncate text-[color:var(--foreground)] font-medium'>
            {currentTrack?.title ?? currentTrack?.src ?? 'Unbekannter Track'}
          </span>
          <span className='text-[11px] text-[color:var(--muted)] tabular-nums'>
            {formatTime(displayDurations[clampedIndex] ?? duration ?? 0)}
          </span>
          {isPlaying ? (
            <span className='flex items-center gap-1 text-[11px] font-semibold text-[color:var(--accent)]'>
              <span
                className='h-2 w-2 rounded-full bg-[color:var(--accent)] animate-pulse'
                aria-hidden='true'
              />
              Spielt
            </span>
          ) : null}
        </div>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() =>
              handleSelect(
                (clampedIndex - 1 + normalized.length) % normalized.length
              )
            }
            className='cursor-pointer rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-strong)]'
            aria-label='Vorheriger Track'
          >
            ‹
          </button>
          <button
            type='button'
            onClick={handlePlayCurrent}
            className='cursor-pointer rounded-full bg-[color:var(--accent)] px-4 py-1 text-sm font-semibold text-white shadow-sm transition hover:opacity-90'
            aria-label='Play playlist from start'
          >
            <PlayIcon className='h-4 w-4' />
          </button>
          <button
            type='button'
            onClick={handlePauseAll}
            className='cursor-pointer rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-1 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-strong)]'
            aria-label='Pause playlist'
          >
            <PauseIcon className='h-4 w-4' />
          </button>
          <button
            type='button'
            onClick={() => handleSelect((clampedIndex + 1) % normalized.length)}
            className='cursor-pointer rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-strong)]'
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
            className='h-2 rounded-full bg-[color:var(--accent)]'
            style={{
              width: duration
                ? `${Math.min(100, (currentTime / duration) * 100)}%`
                : '0%',
            }}
          />
        </div>
        <div className='mt-1 flex justify-between text-[11px] text-[color:var(--muted)]'>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className='max-h-64 overflow-y-auto rounded-lg border border-[color:var(--border-strong)] bg-[color:var(--surface)]'>
        {normalized.map((track, index) => {
          const isActive = index === clampedIndex
          return (
            <button
              key={`${track.src}-${track.title ?? 'track'}`}
              type='button'
              onClick={() => handleSelect(index)}
              className={`flex w-full items-center justify-between gap-1.5 px-3 py-1.5 text-left text-sm transition cursor-pointer ${
                isActive
                  ? 'bg-gray-100 text-[color:var(--foreground)]'
                  : 'text-[color:var(--muted)] hover:bg-[color:var(--surface-strong)]'
              } ${index < normalized.length - 1 ? 'border-b border-[color:var(--border)]' : ''}`}
            >
              <span className='truncate'>{track.title ?? track.src}</span>
              <span className='flex items-center gap-2 text-[11px] text-[color:var(--muted)]'>
                <span
                  className={
                    isActive ? 'font-semibold text-[color:var(--accent)]' : ''
                  }
                >
                  {isActive
                    ? isPlaying
                      ? 'Spielend'
                      : 'Pausiert'
                    : 'Tippen zum Abspielen'}
                </span>
                <span className='tabular-nums'>
                  {formatTime(displayDurations[index] ?? 0)}
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

function safeParseTracks(value: string): Track[] {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed)
      ? parsed.filter((item): item is Track => typeof item?.src === 'string')
      : []
  } catch (error) {
    console.warn('AudioPlaylist: could not parse tracks string', error)
    return []
  }
}

function normalizeTracks(value: unknown): Track[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is Track => typeof item?.src === 'string')
  }

  if (typeof value === 'string') {
    return safeParseTracks(value)
  }

  if (value && typeof value === 'object') {
    const entries = Object.values(value as Record<string, unknown>)
    return entries.filter(
      (item): item is Track => typeof item?.src === 'string'
    )
  }

  return []
}
