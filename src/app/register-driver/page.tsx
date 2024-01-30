'use client'
import { P2PCabNavBar } from '@/components/nav-bar'
import DriverRegisterer from '@/components/register-driver'
import { NextUIProvider } from '@nextui-org/react'
function App() {
 
  return (    
    <>
         <NextUIProvider>
      <P2PCabNavBar pageIndex={1}/>
     <DriverRegisterer />
     </NextUIProvider>
    </>
  )
}

export default App
