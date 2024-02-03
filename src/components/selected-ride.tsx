import { Avatar, Button, Card, CardBody, CardFooter, Chip, Divider, Spacer, Textarea } from "@nextui-org/react"
import { ReactNode } from "react"

export interface Ride{
    startAddress:string;
    endAddress:string;
    fare:number,
    dist:number
}

export function RideDetails(props:{ride:Ride,footer?:ReactNode,children?:ReactNode}){
    return <> 
    <center>
      <Card isBlurred >
        <CardBody>
   


<Spacer className="h-2"/>

<Textarea
    isReadOnly
    label="Starts From"
    value={props.ride.startAddress}
    />
<Spacer/><Spacer/>
<Textarea
    isReadOnly
    label="Ends At"
    value={props.ride.endAddress}
    />
<Spacer/><Spacer/>
<Divider/>
    {props.children}
    <Spacer/><Spacer/>
<div className="flex">

    <h1>Fare : </h1>
    <Chip
variant="flat"
avatar={
  <Avatar
    name="JW"
    src="https://i.pravatar.cc/300?u=a042581f4e29026709d"
  />
}
>
{(props.ride.fare/10**18) * props.ride.dist}  Eth 
</Chip>
   
</div>
<Spacer className="h-2"/>

        </CardBody>
     <CardFooter>
      <center>
        {props.footer}
      
      </center>
     </CardFooter>
      </Card>
    </center>
  
  </>
}