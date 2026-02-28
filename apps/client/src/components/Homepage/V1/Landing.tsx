import GlobeComponent from '@/components/General/Globe'
import React from 'react'
import HeroLeft from './HeroLeft'

function Landing() {
  return (
    <div className='w-full h-screen flex items-center justify-between text-4xl font-bold font-mono'>
    <div className='w-1/2 px-20 flex flex-col gap-10'>
      {/* <h1 className='text-4xl font-semibold'>Code-X: Your Ultimate Interviewing Platform</h1>
      <p className='text-xl font-medium text-neutral-400'>Unlock your coding potential with personalized learning, real-time feedback, and a supportive community.</p>
      <div className='flex gap-6'>
      </div> */}
      <HeroLeft />
    </div>
    <GlobeComponent />
    </div>
  )
}

export default Landing
