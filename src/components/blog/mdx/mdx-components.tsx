import type { AnchorHTMLAttributes } from 'react'
import Link from 'next/link'
import { AudioPlayer } from '@/components/blog/mdx/AudioPlayer'
import { MDXPre } from '@/components/blog/mdx/MDXPre'
import { Youtube } from '@/components/blog/mdx/Youtube'
import { AudioPlaylist } from '@/components/blog/mdx/AudioPlaylist'
import { Image } from '@/components/blog/mdx/Image'
import { Grid } from '@/components/blog/mdx/Grid'

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
