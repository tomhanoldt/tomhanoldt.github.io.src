import Image from 'next/image'
import { familiarTech, services } from '../constants'

type SkillsSectionProps = Record<string, never>

export const SkillsSection = ({}: SkillsSectionProps) => {
  return (
    <section
      id='skills'
      className='space-y-6 rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-sm relative overflow-hidden'
    >
      <div className='space-y-2'>
        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-(--accent)'>
          skills
        </p>
        <h2 className='text-3xl font-semibold text-slate-900'>
          What I can bring to your team
        </h2>
        <p className='max-w-3xl text-sm leading-relaxed text-slate-700'>
          Wide tooling knowledge plus a focus on concepts, maintainability and
          team work.
        </p>
      </div>
      <div className='grid gap-6 lg:grid-cols-[1.05fr_0.95fr]'>
        <div className='rounded-lg border border-[#e4e4e4] bg-[#f9f9f9] p-4 shadow-inner'>
          <h3 className='text-lg font-semibold text-slate-900'>Services</h3>
          <ul className='mt-3 grid gap-2 text-sm text-slate-800'>
            {services.map((item) => (
              <li key={item} className='flex items-start gap-2'>
                <span className='text-(--accent)'>-</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className='rounded-lg border border-[#e4e4e4] bg-[#f9f9f9] p-4 shadow-inner'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-slate-900'>
              I am also familiar with
            </h3>
          </div>
          <div className='mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4'>
            {familiarTech.map((tool) => (
              <div
                key={tool.name}
                className='flex flex-col items-center gap-2 rounded border border-[#e0e0e0] bg-white px-3 py-3 text-center text-xs font-semibold text-slate-800 shadow-sm'
              >
                <div className='relative h-11.25 w-full self-stretch'>
                  <Image
                    src={tool.icon}
                    alt={tool.name}
                    fill
                    className='object-contain'
                    sizes='40px'
                  />
                </div>
                {tool.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
