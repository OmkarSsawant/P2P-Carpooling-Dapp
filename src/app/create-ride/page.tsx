'use client'
import { P2PCabNavBar } from '@/components/nav-bar'

import { NextUIProvider, Spacer } from '@nextui-org/react'
import RideCreator from '@/components/create-ride'
 function CreateRide() {
 
  return (    
    <>
        <NextUIProvider>
      <P2PCabNavBar pageIndex={2}/>
      <Spacer className='h-2'/>
     <RideCreator />
     </NextUIProvider>
    </>
  )
}

export default CreateRide
