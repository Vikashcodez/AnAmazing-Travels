import React from 'react'
import TravelHero from '../components/Hero'
import ActivitiesSection from '../components/Actvity'
import HomePackagesSection from '../components/pack'
import TravelEnquiry from '../pages/Enqry'

const Home = () => {
  return (
    <div>
    <TravelHero />
    <ActivitiesSection />
    <HomePackagesSection />
    <TravelEnquiry />
    
    </div>
  )
}

export default Home