import Link from 'next/link'

export function Footer() {
  return (
    <footer className='w-full border-t border-[#111827] bg-[#2f373e] text-white py-6 mt-8'>
      <div className='mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm'>
        <span className='opacity-70'>
          &copy; {new Date().getFullYear()} blog.tomhanoldt.info
        </span>
        <Link href='/sitemap.xml' className='underline hover:text-[#e5e7eb]'>
          Sitemap
        </Link>
      </div>
    </footer>
  )
}
