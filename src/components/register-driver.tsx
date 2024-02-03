import { usePrepareTransactionRequest, useReadContract, useWriteContract } from "wagmi"
import {abi} from '@/abi/Carpooling.json';
import { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, Divider, Input, Spacer, Tab, Tabs, Textarea } from "@nextui-org/react";
import { create, urlSource } from 'ipfs-http-client'
const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http' })
export default function DriverRegisterer(){
    const [selected, setSelected] = useState("driver");
    const {data:hash,error,writeContractAsync} = useWriteContract()
    const result = useReadContract({
        address:"0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi,
        functionName:"connectionStatus"
    })

    const [name,setname] = useState("")
    const [phone,setphone] = useState("")
    const [email,setemail] = useState("")
    const [pincode,setpincode] = useState("")
    const [address,setaddress] = useState("")
    const [carName,setcarName] = useState("")
    const [NoPlate,setNoPlate] = useState("")
    const [color,setcolor] = useState("")
    const [amount,setamount] = useState("")
    const [licenceIPFS,setLicenseIPFS] = useState('')
    const [licenseFile,setLicenseFile] = useState<File|undefined>(undefined)

    
return(<>
   
    { error && (<><h1 color="danger"> Error {error?.message}</h1><br/>,</>)}
    <center>


    <Card style={{
        width:"50%"
    }}>
      <CardBody>
        <Tabs
        selectedKey={selected}
        onSelectionChange={setSelected}
        >
            <Tab key={"driver"} title={"Driver"}>
      <center>
    <h1>Driver Details</h1>
    </center>    
    <Input
          type="text"
          label="Name"
          placeholder="Omkar"
          labelPlacement="outside"
          onSubmit={(t)=>setname(t.currentTarget.value)}
        value={name}
        onChange={(t)=>{
            setname(t.currentTarget.value)
        }}
          //   startContent={
              //     // <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              //   }
              />
    
    <Spacer/>
    <Input
          type="number"
          label="Phone Number"
          placeholder="9876543210"
          labelPlacement="outside"
          onSubmit={(t)=>setphone(t.currentTarget.value)}
          value={phone}
          onChange={(t)=>{
              setphone(t.currentTarget.value)
          }}
          //   startContent={
              //     // <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              //   }
              />
              <Spacer/>
                 
    <Input

          type="email"
          label="Email"
          placeholder="cm.b.73.omkar.sawant@gmail.com"
          labelPlacement="outside"
          onSubmit={(t)=>setemail(t.currentTarget.value)}
          value={email}
          onChange={(t)=>{
              setemail(t.currentTarget.value)
          }}
          //   startContent={
              //     // <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              //   }
              />
    <Spacer/>
    <Spacer/>
          
    <input className="mx-5" type="file" onChange={async fe=>
        {  
            //  console.log(fe.target.files);
        
            setLicenseFile(fe.target.files[0])
        
}} color="secondary"/>
    <Spacer/>
       
    <Input

          type="number"
          label="Pincode"
          
          placeholder="416602"
          labelPlacement="outside"
          onSubmit={(t)=>setpincode(t.currentTarget.value)}
          value={pincode}
          onChange={(t)=>{
              setpincode(t.currentTarget.value)
          }}
          //   startContent={
              //     // <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              //   }
              />
    
    <Spacer/>
    <Spacer/>
    <Spacer/>
    <Textarea
  onSubmit={(t)=>setaddress(t.currentTarget.value)}
  value={address}
  onChange={(t)=>{
      setaddress(t.currentTarget.value)
  }}
label="Address"
      placeholder="Enter your Address"
      className="max-w-xs"
    />
    <Spacer/>
    <center>
    <Button color="primary" onClick={()=>{
        setSelected("car")
    }}>
        Next
    </Button>
    </center>
   
    </Tab>
        <Tab key={"car"} title={"car"}>
<center>
    <h1>Car Details</h1>
    </center>    
    <Input

          type="text"
          label="Name"
          placeholder="Mercedez Benz"
          labelPlacement="outside"
          onSubmit={(t)=>setcarName(t.currentTarget.value)}
          value={carName}
          onChange={(t)=>{
              setcarName(t.currentTarget.value)
          }}      
          //   startContent={
              //     // <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              //   }
              />
    
    <Spacer/>
    <Input

          type="text"
          label="Number Plate"
          placeholder="MH072299"
          labelPlacement="outside"
          value={NoPlate}
          onChange={(t)=>{
              setNoPlate(t.currentTarget.value)
          }}      
          //   startContent={
              //     // <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              //   }
              />
              <Spacer/>
                 
    <Input

          type="text"
          label="Color"
          placeholder="Sky Blue"
          labelPlacement="outside"
          value={color}
          onChange={(t)=>{
              setcolor(t.currentTarget.value)
          }}      
          //   startContent={
              //     // <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              //   }
              />
    
    <Spacer/>
       
    <Input

type="number"
          label="Fare (per km)"
          value={amount}
          onChange={(t)=>{
              setamount(t.currentTarget.value)
          }}      
          placeholder="0.01 ETH"
          labelPlacement="outside"
          
          //   startContent={
              //     // <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              //   }
              />
    
    <Spacer/>
    <Spacer/>
    <Spacer/>
    <Spacer/>
    <Spacer/>
    <center>
    <Button color="success" style={{
        color:"white"
    }} onClick={async (ev)=>{
        console.log(name);
   
        const abuf = await licenseFile!.arrayBuffer()
        console.log(abuf);
        
            const {path,cid} = await ipfs.add(abuf)
            console.log(path,cid)
        

          let txn = await   writeContractAsync({
                address:"0x5FbDB2315678afecb367f032d93F642f64180aa3",
                abi,
                functionName:"registerDriver",
                args:[
                      name,
                      BigInt(phone),
                      email,
                      path,
                      address,
                      BigInt(pincode)  
                ]
            })
            
    
          let txn2 =  await  writeContractAsync({
                address:"0x5FbDB2315678afecb367f032d93F642f64180aa3",
                abi,
                functionName:"registerCar",
                
                args:[
                    "carName",
                    "NoPlate",
                    "color",
                    BigInt(parseFloat("0.4") * 10**18)
                ],
            })
            alert(`Success : Registered You as Driver \n[${txn},${txn2}]`)
            


        
      
        
    }}> Register As Driver </Button>
    </center>
 
    </Tab>
    </Tabs>
    
      </CardBody>
    </Card>
    </center>
    </>
    
    )
}