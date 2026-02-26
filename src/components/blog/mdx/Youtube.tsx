import type { FC } from 'react'

type YouTubeProps = {
  id: string
  title?: string
}

export const Youtube: FC<YouTubeProps> = ({ id, title }) => {
  return (
    <div className='my-8 overflow-hidden rounded-2xl border border-slate-200 shadow-sm'>
      <div className='relative aspect-video w-full bg-slate-100'>
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={title ?? 'YouTube video'}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          className='absolute inset-0 h-full w-full'
          loading='lazy'
        />
      </div>
      {title && (
        <p className='px-4 pb-3 pt-2 text-sm text-slate-600'>{title}</p>
      )}
    </div>
  )
}
