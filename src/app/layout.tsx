import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/layout/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Tom Hanoldt | developer, artist, human',
  description:
    'Full stack developer, artist and human from Berlin — building products, mentoring teams and supporting open source.',
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <div className='min-h-screen bg-background text-foreground mx-auto w-full max-w-5xl'>
          <div className='flex flex-col gap-6 px-4 pb-6 pt-8 sm:px-6 lg:px-0'>
            {children}
          </div>
        </div>

        <Footer />
      </body>
    </html>
  )
}

export default RootLayout
