import React from 'react'
import Header from '../components/UI/Header'
import { useSelector } from 'react-redux'
import Footer from '../components/UI/Footer'
import Header1 from '../components/UI/Header1'
import Footer1 from '../components/UI/Footer1'
// import Maintain from '../components/Screen/Landing/Maintain'

const LandingLayout = ({inner}) => {
    
  return (
    <div className='bg-[var(--bg)] min-h-screen'>
      {/* <Maintain /> */}
        {/* <Header /> */}
        <Header1 />
        <div className='md:py-6 py-3 mx-auto overflow-hidden'>
          {inner}
        </div>
        {/* <Footer /> */}
        <Footer1 />
    </div>
  )
}

export default LandingLayout