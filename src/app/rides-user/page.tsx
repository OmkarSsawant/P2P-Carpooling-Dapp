'use client'

import { useAccount, useReadContract, useWriteContract } from "wagmi"
import {abi} from '@/abi/Carpooling.json';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, Tab, Tabs, Textarea, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { P2PCabNavBar } from "@/components/nav-bar";
import { RideDetails } from "@/components/selected-ride";

export default function AciveRides(){
  const [activeRide,setActiveRide] = useState(undefined)
  const {address,isConnected} = useAccount()
  const {writeContractAsync} = useWriteContract()
  const [review,setReview] = useState('')
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
  onOpen()
}
  }
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
    return (<>
        <P2PCabNavBar pageIndex={5}/>
        <Spacer className="h-10"/>
              {activeRide ? <RideDetails ride={{
                startAddress:activeRide.ride.start.address.freeformAddress,
                endAddress:activeRide.ride.end.address.freeformAddress,
                dist:activeRide.ride.dist,
                fare:activeRide.ride.fare
              }} footer={
                <Button color="danger" onClick={(ev)=>{ev.preventDefault();endRide(activeRide);}}> End Ride</Button>
              }/> : <center><h1>No Active Ride</h1></center>} 
                     
                     <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Ride Ended Successfully!</ModalHeader>
              <ModalBody>
                <Spacer/>
                <Spacer/>
              <Textarea
  title="Review"
  placeholder="Enter your review about the driver"
value={review}
              onInput={i => setReview(i.currentTarget.value)}
              />
                <Spacer/>
                <Spacer/>

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={async ()=> {
                  //Add review to blockchain
                  await writeContractAsync({
                    abi,
                    address:"0x5FbDB2315678afecb367f032d93F642f64180aa3",
                    functionName:"addReview",
                    args:[
                      activeRide!.ride.driverAddress,
                      review  
                    ]
                  })
                  setActiveRide(undefined)
                  onClose()
                }}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>)

async function loadActiveRidesOfUser() {
  let res = await fetch(`/api/user-rides?ua=${address}&active`)
  let results = await res.json()
  console.log(address,results);
  
  setActiveRide(results[0])
}
}


