import { useReadContract } from "wagmi"
import {abi} from '@/abi/Carpooling.json';
import { Listbox, ListboxItem } from "@nextui-org/react";
import mongoClientPromise from '@/lib/mongo';

export default function AciveRides(){
    
    const rides   = useReadContract({
        abi,
         address:"0x5FbDB2315678afecb367f032d93F642f64180aa3",
         functionName:"getActiveRides",  
       })
    return (<>
         <Listbox>{
           Array.from(rides.data).map(e => <ListboxItem key={e.RID}>
            {JSON.stringify(e)}
           </ListboxItem>)
        }
        </Listbox>
    </>)
}