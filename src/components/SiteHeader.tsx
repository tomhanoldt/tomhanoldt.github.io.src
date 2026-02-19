import Link from 'next/link'

export async function SiteHeader() {
  const tags = ['code', 'painting', 'text', 'music', 'art']
  const topTags = tags.slice(0, 8)

  return (
    <header className='sticky top-0 z-30 h-10 border-b border-[#111827] bg-[#2f373e] text-white shadow-md backdrop-blur'>
      <div className='mx-auto flex h-full max-w-5xl items-center justify-between px-6'>
        <Link
          href='/'
          className='text-[14px] font-semibold !text-[#838383] transition hover:text-[#e5e7eb] relative top-[8px] left-[-23px]'
        >
          blog.tomhanoldt.info
        </Link>
        <nav className='flex items-center gap-3 text-sm font-medium text-[#cbd5e1]'>
          {topTags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className='rounded-full px-3 py-2 transition hover:bg-[#1f2937] hover:text-white'
            >
              #{tag}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
