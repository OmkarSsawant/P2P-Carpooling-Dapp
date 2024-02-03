import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, NextUIProvider } from '@nextui-org/react'
import { FunctionComponent, useState } from 'react'
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi'
interface PageInfo{
  pageIndex:number
}

export const P2PCabNavBar : FunctionComponent<PageInfo> = ({pageIndex})=>{
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
    return (  <Navbar
        title='Peer2Peer Carpooling'
        
        >
          <NavbarBrand >
        
        <p className="font-bold text-inherit">Peer2Peer Carpooling</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color={pageIndex==1?undefined:"foreground"} href="/register-driver">
            Register Driver
          </Link>
        </NavbarItem>
        <NavbarItem >
          <Link color={pageIndex==2?undefined:"foreground"}  href="/create-ride" >
            Create Ride
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color={pageIndex==3?undefined:"foreground"}  href="/book-a-cab">
            Book A Cab
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color={pageIndex==3?undefined:"foreground"}  href="/rides-driver">
            Driver Rides
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color={pageIndex==3?undefined:"foreground"}  href="/rides-user">
            User Rides
          </Link>
        </NavbarItem>

        </NavbarContent>
    <NavbarContent justify='end'>

        <NavbarItem>
         
          {account.status === 'connected' ? (
          <Button color="primary" variant="flat" onClick={() => disconnect()}>
            Disconnect
          </Button>
        ) :  <Button color="primary" variant="flat" onClick={()=> connect({connector:getMetamask()})}>
        Connect
      </Button> }  
     
      </NavbarItem>
      </NavbarContent>
                </Navbar>);
}