'use client'
import CarCreator from '@/components/create-car'
import { Button, NextUIProvider } from '@nextui-org/react'
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi'
function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  var metamask:Connector;
  const getMetamask = ()=> {
    if(metamask)
    return metamask
    metamask = connectors.find((e)=>e.id=="io.metamask")!
    return metamask
  }
  return (
    <>
    <NextUIProvider>
        {account.status === 'connected' ? (
          <Button color="primary" variant="flat" onClick={() => disconnect()}>
            Disconnect
          </Button>
        ) :  <Button color="primary" variant="flat" onClick={()=> connect({connector:getMetamask()})}>
        Connect
      </Button> }    
     <CarCreator/>
      </NextUIProvider>
    </>
  )
}

export default App
