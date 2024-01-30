

import './globals.css'
import type { Metadata } from 'next'
import { type ReactNode } from 'react'

import { Providers } from '@/app/providers'
import { Navbar, NextUIProvider } from '@nextui-org/react'




export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body >
      <Providers>
        
        <main className='dark text-foreground bg-background ' style={{
          height:"100vh"
        }}>
          
      
        {props.children}


        </main>
        
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Peer2Peer Carpooling',
  description: 'Generated by create-wagmi',
}
