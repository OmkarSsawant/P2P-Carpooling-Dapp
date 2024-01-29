import { usePrepareTransactionRequest, useReadContract, useWriteContract } from "wagmi"
import {abi} from '@/abi/Carpooling.json';
import { useEffect } from "react";
import { Button } from "@nextui-org/react";


export default function CarCreator(){

    const {data:hash,writeContract,error} = useWriteContract()
    const result = useReadContract({
        address:"0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi,
        functionName:"connectionStatus"
    })


    return(<>
    <h1>HASH : {hash}</h1>
    <h1>{new String(result.data)}</h1>  <h1 color="#fffffff">{error?.message}</h1><Button onClick={()=>  writeContract({
        address:"0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi,
        functionName:"registerCar",
        
        args:[
            "Car1",
            "MH072299",
            "Blue",
            BigInt(0.03 * 10**18)
        ],
       


    })}> Register Car </Button></>)
}