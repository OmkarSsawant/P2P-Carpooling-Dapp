'use client'
import { PeerCabNavBar } from '@/components/nav-bar'
import DriverRegisterer from '@/components/register-driver'
import { NextUIProvider } from '@nextui-org/react'
function App() {
 
  return (    
    <>
         
         <NextUIProvider>
      <PeerCabNavBar/>
      <h1>Landing Page</h1>
      </NextUIProvider>
    </>
  )
}

export default App
