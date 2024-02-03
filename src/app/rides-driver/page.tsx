'use client'

import { useAccount, useReadContract } from "wagmi"
import {abi} from '@/abi/Carpooling.json';
import { Button, Card, CardBody, Listbox, ListboxItem, Spacer, Tab, Tabs } from "@nextui-org/react";
import mongoClientPromise from '@/lib/mongo';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { P2PCabNavBar } from "@/components/nav-bar";
import { title } from "process";

export default function AciveRides(){
  const [rides,setRides] = useState([])
  const [activeRide,setActiveRide] = useState({"name":"Work Ride"})
  const {address,isConnected} = useAccount()
    useEffect(()=>{
      console.log([isConnected,address]);
      if(isConnected)
      loadActiveRidesOfDriver()
    },[isConnected,address])
    return (<>
        <P2PCabNavBar pageIndex={0}/>
        <Spacer className="h-10"/>
          <Tabs>
          <Tab key="Active Ride" title="Active Ride">
              {activeRide ? <center><Card className="w-1/2">
                <CardBody>
                  <div>
                  <h1>Ride Name : {activeRide?.name}</h1>
                    <Button className="w-50"> Start Ride</Button>
                  </div>
                 
                </CardBody>
              </Card></center> : <center><h1>No Active Ride</h1></center>}
          </Tab>
          <Tab key="History" title="History">
        </Tab>
        </Tabs>
       
       
    </>)

async function loadActiveRidesOfDriver() {
  let res = await fetch(`/api/driver-rides?da=${address}`)
  let results = await res.json()
  console.log(address,results);
  
  setRides(results)
}
}


