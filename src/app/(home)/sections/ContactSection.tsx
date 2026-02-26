import Image from 'next/image'
import { social } from '../constants'

type ContactSectionProps = Record<string, never>

export const ContactSection = ({}: ContactSectionProps) => {
  return (
    <section
      id='contact'
      className='space-y-4 rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-sm relative overflow-hidden'
    >
      <div className='space-y-2'>
        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-(--accent)'>
          contact
        </p>
        <h2 className='text-3xl font-semibold text-slate-900'>
          Let&apos;s build together
        </h2>
        <p className='max-w-3xl text-sm leading-relaxed text-slate-700'>
          I enjoy commercial collaborations and open source work alike. Please
          drop me a line if you have an idea, need mentoring, or want to talk
          shop.
        </p>
      </div>
      <div className='grid gap-4 md:grid-cols-[1.1fr_0.9fr] md:items-center'>
        <div className='flex flex-wrap gap-3 text-sm font-semibold text-slate-800'>
          <a
            href='mailto:info@tomhanoldt.info'
            className='inline-flex items-center gap-2 rounded-full border border-[#d9d9d9] bg-[#f9f9f9] px-5 py-3 text-slate-800 shadow-inner transition hover:-translate-y-0.5 hover:shadow-md'
          >
            <span>@</span>
            info@tomhanoldt.info
          </a>
        </div>
        <div className='flex flex-wrap gap-3 md:justify-end'>
          {social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target='_blank'
              rel='noreferrer'
              className='flex items-center gap-2 rounded-full border border-[#d9d9d9] bg-[#f9f9f9] px-4 py-2 text-sm font-semibold text-slate-800 shadow-inner transition hover:-translate-y-0.5 hover:shadow-md'
            >
              <Image
                src={item.icon}
                alt={`${item.name} icon`}
                width={18}
                height={18}
              />
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
