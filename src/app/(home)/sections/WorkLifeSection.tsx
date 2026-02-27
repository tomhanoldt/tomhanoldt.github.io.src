import Image from 'next/image'
import { workLife } from '../constants'

type WorkLifeSectionProps = Record<string, never>

export const WorkLifeSection = ({}: WorkLifeSectionProps) => {
  return (
    <section
      id='work'
      className='space-y-6 rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-sm relative overflow-hidden'
    >
      <div className='space-y-2'>
        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-(--accent)'>
          work life
        </p>
        <h2 className='text-3xl font-semibold text-slate-900'>
          Projects, teams and companies
        </h2>
        <p className='max-w-3xl text-sm leading-relaxed text-slate-700'>
          A few stations from the past years - building products, scaling teams
          and focusing on UX and delivery.
        </p>
      </div>
      <div className='space-y-3'>
        {workLife.map((item) => (
          <div
            key={item.name}
            className='flex flex-col gap-3  border border-[#e4e4e4] bg-[#f9f9f9] p-3 shadow-inner sm:flex-row sm:items-center'
          >
            <div className='sm:min-w-37.5'>
              <Image
                src={item.logo}
                alt={`${item.name} logo`}
                width={item.logoWidth}
                height={item.logoHeight}
                className='h-auto w-auto max-h-7.5 max-w-30 mx-auto shrink-0 rounded-lg sm:max-h-none'
              />
            </div>
            <div className='min-w-0 space-y-2 leading-tight'>
              <div className='flex items-center gap-0'>
                <p className='text-lg font-semibold text-slate-900'>
                  {item.name}
                </p>
                <span className='rounded bg-[#ededed] mx-2 px-2 py-0.5 text-xs font-semibold text-slate-700'>
                  {item.period}
                </span>
              </div>
              {item.link ? (
                <a
                  href={item.link}
                  target='_blank'
                  rel='noreferrer'
                  className='text-xs font-semibold text-(--accent) underline'
                >
                  {item.link}
                </a>
              ) : null}
              <p className='text-sm leading-relaxed text-slate-700'>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
