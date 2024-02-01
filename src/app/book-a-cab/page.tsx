'use client'

import { CabBooker } from "@/components/book-cab";
import { P2PCabNavBar } from "@/components/nav-bar";
import { NextUIProvider, Spacer } from "@nextui-org/react";

export default function BookACab(){
    return(<>
       <NextUIProvider>
      <P2PCabNavBar pageIndex={3}/>
      <Spacer className='h-2'/>
        <CabBooker/>
     </NextUIProvider>
    </>)
}