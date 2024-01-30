'use client'
import { P2PCabNavBar } from '@/components/nav-bar'
import DriverRegisterer from '@/components/register-driver'
import { NextUIProvider } from '@nextui-org/react'
 function CreateRide() {
 
  return (    
    <>
         <NextUIProvider>
      <P2PCabNavBar pageIndex={2}/>
     <h1>CREATE RIDE</h1>
     </NextUIProvider>
    </>
  )
}

export default CreateRide
