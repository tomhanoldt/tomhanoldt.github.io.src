import { openSource } from '../constants'

type OpenSourceSectionProps = Record<string, never>

export const OpenSourceSection = ({}: OpenSourceSectionProps) => {
  return (
    <section
      id='open-source'
      className='space-y-6 rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-sm relative overflow-hidden'
    >
      <span
        className='absolute left-0 top-0 h-full w-1 bg-(--accent)'
        aria-hidden
      />
      <div className='space-y-2'>
        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-(--accent)'>
          open source
        </p>
        <h2 className='text-3xl font-semibold text-slate-900'>
          Tools I share with the community
        </h2>
        <p className='max-w-3xl text-sm leading-relaxed text-slate-700'>
          Lightweight helpers for shipping websites, automating deploys and
          smoothing UI workflows.
        </p>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        {openSource.map((category) => (
          <div
            key={category.title}
            className='rounded-lg border border-[#e4e4e4] bg-[#f9f9f9] p-3 shadow-inner'
          >
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-slate-900'>
                {category.title}
              </h3>
            </div>
            <div className='mt-2 grid gap-1 text-sm font-semibold text-slate-800'>
              {category.projects.map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  target='_blank'
                  rel='noreferrer'
                  className='flex items-center justify-between rounded px-2 py-2 hover:bg-[#ededed]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-(--accent)'>&gt;</span>
                    {name}
                  </span>
                  <span className='text-xs text-slate-500'>github</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
