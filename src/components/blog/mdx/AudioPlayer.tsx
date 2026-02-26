import type { FC } from 'react'

export type Track = {
  src: string
  title?: string
}

type AudioPlayerProps = Track

export const AudioPlayer: FC<AudioPlayerProps> = ({ src, title }) => {
  return (
    <figure className='my-6 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 px-4 py-3'>
      {title && (
        <figcaption className='mb-2 text-sm font-medium text-slate-700'>
          {title}
        </figcaption>
      )}
      <audio
        controls
        preload='none'
        className='w-full'
        src={src}
        aria-label={title ?? 'Audio player'}
      >
        Your browser does not support the audio element.
      </audio>
    </figure>
  )
}
