type AudioPlayerProps = {
  src: string
  title?: string
}

export function AudioPlayer({ src, title }: AudioPlayerProps) {
  return (
    <figure className='my-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-3'>
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
