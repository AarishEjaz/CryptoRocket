import React from 'react'
import Header from '../components/UI/Header'
import { useSelector } from 'react-redux'
import Footer from '../components/UI/Footer'
import Header1 from '../components/UI/Header1'
import Footer1 from '../components/UI/Footer1'
import Maintain from '../components/Screen/Landing/Maintain'

const LoginLayout = ({inner}) => {
    
  return (
    <div className='min-h-screen'>
      {/* <Maintain /> */}
        {/* <Header /> */}
        <Header1 />
        <div className='mx-auto overflow-hidden'>
          {inner}
        </div>
        {/* <Footer /> */}
        <Footer1 />
    </div>
  )
}

export default LoginLayout;