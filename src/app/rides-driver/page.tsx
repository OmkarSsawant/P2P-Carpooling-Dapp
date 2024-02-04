'use client'

import { useAccount, useReadContract, useWriteContract } from "wagmi"
import {abi} from '@/abi/Carpooling.json';
import { Button, Card, CardHeader, Listbox, ListboxItem, Spacer, Tab, Tabs ,Image, Divider, CardBody, CardFooter, Link, Chip} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { P2PCabNavBar } from "@/components/nav-bar";
import { RideDetails } from "@/components/selected-ride";
import { useRouter } from "next/router";

export default function AciveRides(){
  const [activeRide,setActiveRide] = useState(undefined)
  const [rides,setRides] = useState([])

  const {address,isConnected} = useAccount()
  const {writeContractAsync,error} = useWriteContract()
  const ridesHistory = useReadContract({
    abi,
    address:"0x5FbDB2315678afecb367f032d93F642f64180aa3",
    functionName:"getRidesOfDriver", 
  })

    useEffect(()=>{
      console.log([isConnected,address]);
      if(isConnected)
      loadRidesOfDriver()
    },[isConnected,address])
  async function startRide({_id,ride}:{_id:string;ride:any}): Promise<void> {
     await writeContractAsync({
        address:"0x5FbDB2315678afecb367f032d93F642f64180aa3",
            abi,
            functionName:"startRide",
            args:[
              BigInt(ride.rideId)
            ]
      })
      await fetch(`/api/driver-rides?start-ride=${_id}`,{
        method:'PATCH'
      })
      alert("Ride Started!")
  }
  const router = useRouter()

  function showRide(_id: any) {
    router.push(`/cab-nav/${_id}`)
  }

    return (<>
        <P2PCabNavBar pageIndex={4}/>
        {error && <p className="bg-white text-danger">{error.message}</p>}
        <Spacer className="h-10"/>
          <Tabs className="mx-10">
          <Tab  className="mx-5" key="Active Ride" title="Active Ride">
              {activeRide ? <center><div className="w-1/2">
                <RideDetails
              
              ride={{
                startAddress:activeRide.ride.start.address.freeformAddress,
                endAddress:activeRide.ride.end.address.freeformAddress,
                dist:activeRide.ride.dist,
                fare:activeRide.ride.fare
              }} footer={
                <>
                <Spacer/>
                <Button color="primary" onClick={(ev)=>{ev.preventDefault();showRide(activeRide._id);}}> Show Ride</Button>

                </>
   
   }/>

              </div> 
              </center>: <center><h1>No Active Ride</h1></center>}
          </Tab>
          <Tab className="mx-5" key="Pending" title="Pending">
            <center>
              
          {rides.map(({_id,ride})=>      {
            return (<RideDetails ride={{
                  dist:ride.dist,
                  startAddress:ride.start.address.freeformAddress,
                  endAddress:ride.end.address.freeformAddress,
                  fare:ride.fare
            }} footer={<Button onClick={ev=>startRide({_id,ride})}>Start Ride</Button>}/>);
          })}
              
   
                        </center>
        </Tab>
        <Tab key={"history"}  title="History">
             {ridesHistory.data ? Array.from(ridesHistory.data!).map((ride:any)=>      {
            
            if(!ride.active){
              return (<RideDetails ride={{
                    dist:ride.dist,
                    startAddress:ride.start.address.freeformAddress,
                    endAddress:ride.end.address.freeformAddress,
                    fare:ride.fare
              }} footer={<center><Chip>{ride.paid ? "Completed" : "Pending"}</Chip></center>}/>);
            }
            else return (<></>)
          }) : <><center>No History Found</center></>}
        </Tab>
        </Tabs>
       
       
    </>)

async function loadRidesOfDriver() {
  // all rides
  let res = await fetch(`/api/driver-rides?da=${address}&status=pending`)
  let results = await res.json()
  console.log(address,results);
  setRides(results)

  // active ride
  let ares = await fetch(`/api/driver-rides?da=${address}&status=ongoing`)
  let aresults = await ares.json()
  console.log(address,aresults[0]);
  setActiveRide(aresults[0])
}

}


