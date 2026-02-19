import type { AnchorHTMLAttributes } from 'react'
import Link from 'next/link'
import { AudioPlayer } from '@/components/mdx/AudioPlayer'
import { MDXPre } from '@/components/mdx/MDXPre'
import { Youtube } from '@/components/mdx/Youtube'
import { AudioPlaylist } from '@/components/mdx/AudioPlaylist'
import { Image } from '@/components/mdx/Image'
import { Grid } from '@/components/mdx/Grid'

export const mdxComponents = {
  Grid,
  Youtube,
  AudioPlayer,
  AudioPlaylist,
  pre: MDXPre,
  Image: Image,
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <Link
      href={props.href ?? '#'}
      className='font-semibold text-blue-700 underline-offset-4 hover:underline'
    >
      {props.children}
    </Link>
  ),
}
