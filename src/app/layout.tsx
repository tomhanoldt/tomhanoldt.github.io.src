import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SiteHeader } from '@/components/SiteHeader'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'blog.tomhanoldt.info',
  description: 'A static-exported blog powered by Next.js, MDX, and Tailwind.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} text-slate-900 antialiased`}
      >
        <SiteHeader />
        <main className='mx-auto max-w-5xl px-6 pb-16 pt-6 lg:px-0'>
          {children}
        </main>
      </body>
    </html>
  )
}
