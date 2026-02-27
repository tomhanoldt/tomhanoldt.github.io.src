import type { Metadata } from 'next'
import { HeadMenu } from '@/components/layout/HeadMenu'
import { homeMenuLinks } from '@/components/layout/menuLinks'
import {
  ContactSection,
  HeroSection,
  OpenSourceSection,
  SkillsSection,
  WorkLifeSection,
} from './sections'

export const metadata: Metadata = {
  title: 'Tom Hanoldt | developer, artist, human',
  description:
    'Full stack developer, artist and human from Berlin. Work life, open source, skills and contact information.',
}

const HomePage = () => {
  return (
    <>
      <HeadMenu links={homeMenuLinks} />
      <HeroSection />
      <WorkLifeSection />
      <OpenSourceSection />
      <SkillsSection />
      <ContactSection />
    </>
  )
}

export default HomePage
