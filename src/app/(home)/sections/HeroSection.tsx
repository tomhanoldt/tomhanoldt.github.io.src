import Image from 'next/image'
import Link from 'next/link'

type HeroSectionProps = Record<string, never>

export const HeroSection = ({}: HeroSectionProps) => {
  return (
    <section className='md:mt-6 grid gap-4 md:gap-8 rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr] relative overflow-hidden'>
      <div className='order-2 space-y-4 lg:order-1'>
        <p className='text-base leading-relaxed text-slate-700'>
          I’m a Berlin-based Full Stack Developer and Artist. My journey began
          in the late 90s, turning a lifelong curiosity for technology into a
          career built on technical precision and creative flair. I’m a firm
          believer in Open Source and the power of collaborative building.
        </p>
        <p className='text-base leading-relaxed text-slate-700'>
          Explore my work below - if you see a potential spark for a project,
          let’s connect.
        </p>
        <div className='flex flex-wrap justify-center gap-3 text-sm font-semibold sm:justify-start'>
          <a
            href='#contact'
            className='inline-flex items-center gap-2 rounded-full border border-[#d9d9d9] bg-[#f9f9f9] px-5 py-3 text-slate-800 shadow-inner transition hover:-translate-y-0.5 hover:shadow-md'
          >
            <span>@</span>
            get in contact
          </a>
          <Link
            href='/blog'
            className='inline-flex items-center gap-2 rounded-full border border-[#d9d9d9] bg-[#f9f9f9] px-5 py-3 text-slate-800 shadow-inner transition hover:-translate-y-0.5 hover:shadow-md'
          >
            <Image
              src='/images/social/my_blog.png'
              alt='Blog icon'
              width={16}
              height={16}
            />
            read my blog
          </Link>
        </div>
      </div>
      <div className='order-1 flex items-center justify-center lg:order-2'>
        <div className='rounded-full p-3 shadow-inner'>
          <Image
            src='/images/me/me-circle-comic.png'
            alt='Portrait of Tom Hanoldt'
            width={200}
            height={200}
            className='rounded-full'
            priority
          />
        </div>
      </div>
    </section>
  )
}
