'use client'

import { useAccount, useReadContract, useWriteContract } from "wagmi"
import {abi} from '@/abi/Carpooling.json';
import { Button, Spacer, Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { P2PCabNavBar } from "@/components/nav-bar";
import { RideDetails } from "@/components/selected-ride";

export default function AciveRides(){
  const [activeRide,setActiveRide] = useState(undefined)
  const {address,isConnected} = useAccount()
  const {writeContractAsync} = useWriteContract()
    useEffect(()=>{
      console.log([isConnected,address]);
      if(isConnected)
      loadActiveRidesOfUser()
    },[isConnected,address])
  async function endRide({_id,ride}:{_id:string;ride:any}): Promise<void> {
     
      const res = await fetch(`/api/user-rides?dropped-ride-id=${_id}`,{
        method:'PATCH'
      })
      const {droppedAllUsers} = await res.json()
if(droppedAllUsers){
  await writeContractAsync({
    address:"0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi,
        functionName:"endRide",
        args:[
          ride.driverAddress,
          BigInt(ride.rideId)
        ]
  })
  await fetch(`/api/driver-rides?ride-id=${_id}`,{
    method:'DELETE'
  })
  alert("Ride Ended!")

}
  }

    return (<>
        <P2PCabNavBar pageIndex={0}/>
        <Spacer className="h-10"/>
          <Tabs>
          <Tab key="Active Ride" title="Active Ride">
              {activeRide ? <RideDetails ride={{
                startAddress:activeRide.ride.start.address.freeformAddress,
                endAddress:activeRide.ride.end.address.freeformAddress,
                dist:activeRide.ride.dist,
                fare:activeRide.ride.fare
              }} footer={
                <Button onClick={(ev)=>{ev.preventDefault();endRide(activeRide);}}> Start Ride</Button>
              }/> : <center><h1>No Active Ride</h1></center>}
          </Tab>
          <Tab key="History" title="History">
            <center>
              <h1>All Previous Transactions from Blockchain</h1>
            </center>
        </Tab>
        </Tabs>
       
       
    </>)

async function loadActiveRidesOfUser() {
  let res = await fetch(`/api/user-rides?ua=${address}&active`)
  let results = await res.json()
  console.log(address,results);
  
  setActiveRide(results[0])
}
}


