'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/* eslint-disable @next/next/no-img-element */

export type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function Image(props: ImageProps) {
  const { src = '', alt = '', style, ...rest } = props
  const [isOpen, setIsOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  })

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
      if (e.key === '+') setZoom((z) => clamp(z + 0.25, 1, 4))
      if (e.key === '-') setZoom((z) => clamp(z - 0.25, 1, 4))
    }

    if (isOpen) {
      window.addEventListener('keydown', onKey)

      const prevOverflow = document.body.style.overflow
      const prevTouchAction = document.body.style.touchAction
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'

      return () => {
        window.removeEventListener('keydown', onKey)
        document.body.style.overflow = prevOverflow
        document.body.style.touchAction = prevTouchAction
      }
    }

    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  useEffect(() => {
    if (zoom === 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOffset({ x: 0, y: 0 })
    }
  }, [zoom])

  const portal = useMemo(() => {
    if (!isOpen || typeof document === 'undefined') return null

    return createPortal(
      <div
        className='fixed inset-0 z-120 bg-black/80 backdrop-blur-sm'
        onClick={() => setIsOpen(false)}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
        role='presentation'
      >
        <div className='absolute right-4 top-4 flex gap-2'>
          <button
            type='button'
            className='rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white shadow-sm ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20'
            onClick={(e) => {
              e.stopPropagation()
              setZoom((z) => clamp(z - 0.25, 1, 4))
            }}
          >
            −
          </button>
          <button
            type='button'
            className='rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white shadow-sm ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20'
            onClick={(e) => {
              e.stopPropagation()
              setZoom((z) => clamp(z + 0.25, 1, 4))
            }}
          >
            +
          </button>
          <button
            type='button'
            className='rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white shadow-sm ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20'
            onClick={(e) => {
              e.stopPropagation()
              setZoom(1)
            }}
          >
            Reset
          </button>
          <button
            type='button'
            className='rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white shadow-sm ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20'
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(false)
            }}
          >
            Close
          </button>
        </div>

        <div className='flex h-full w-full items-center justify-center px-2 sm:px-4'>
          <div
            className='relative max-h-[100vh] w-full max-w-6xl overflow-hidden rounded-none bg-black/40 p-2 shadow-2xl sm:max-h-[90vh] sm:rounded-2xl sm:p-4'
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => {
              e.preventDefault()
              const delta = e.deltaY > 0 ? -0.2 : 0.2
              setZoom((z) => clamp(z + delta, 1, 4))
            }}
            onPointerDown={(e) => {
              if (zoom === 1) return
              dragState.current = {
                active: true,
                startX: e.clientX,
                startY: e.clientY,
                originX: offset.x,
                originY: offset.y,
              }
              setIsDragging(true)
              ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
            }}
            onPointerMove={(e) => {
              if (!dragState.current.active) return
              const dx = e.clientX - dragState.current.startX
              const dy = e.clientY - dragState.current.startY
              setOffset({
                x: dragState.current.originX + dx,
                y: dragState.current.originY + dy,
              })
            }}
            onPointerUp={(e) => {
              if (!dragState.current.active) return
              dragState.current.active = false
              setIsDragging(false)
              ;(e.currentTarget as HTMLElement).releasePointerCapture(
                e.pointerId
              )
            }}
            onPointerLeave={() => {
              dragState.current.active = false
              setIsDragging(false)
            }}
          >
            <img
              src={src}
              alt={alt}
              className={`max-h-[85vh] w-full select-none object-contain ${
                zoom > 1 ? 'cursor-grab' : ''
              } ${isDragging ? 'cursor-grabbing' : ''}`}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              }}
              draggable={false}
              onDoubleClick={() => setZoom((z) => (z === 1 ? 2 : 1))}
            />
          </div>
        </div>
      </div>,
      document.body
    )
  }, [alt, isDragging, isOpen, offset.x, offset.y, src, zoom])

  return (
    <>
      <img
        src={src}
        alt={alt}
        {...rest}
        className={`max-w-full rounded-xl border border-(--border) object-contain ${
          rest.className ?? ''
        } cursor-pointer`}
        style={{ marginBottom: '1rem', ...(style ?? {}) }}
        role='button'
        tabIndex={0}
        onClick={() => {
          setIsOpen(true)
          setZoom(1)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(true)
            setZoom(1)
          }
        }}
      />
      {portal}
    </>
  )
}
