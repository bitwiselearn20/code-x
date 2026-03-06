import { LandingNavbar } from '@/components/General/LandingNavbar'
import React from 'react'
import { Testimonials } from './Testimonials'
import Footer from '@/components/General/Footer'
import { FAQ } from './FAQ'
import Landing from './Landing'
import { GlowingEffectDemo } from './InteractiveCards'
import InfoWithVids from './InfoWithVids'

export default function HomeV1() {
  return (
    <>
    <LandingNavbar />
    <Landing />
    <GlowingEffectDemo />
    <InfoWithVids />
    {/* <Testimonials /> */}
    <FAQ />
    <Footer />
    </>
  )
}
