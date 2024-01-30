import { usePrepareTransactionRequest, useReadContract, useWriteContract } from "wagmi"
import {abi} from '@/abi/Carpooling.json';
import { useEffect, useRef, useState } from "react";
import { Autocomplete, AutocompleteItem, Button, Card, CardBody, Chip, Divider, Input, Spacer, Switch, Tab, Tabs, Textarea } from "@nextui-org/react";
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import tt from '@tomtom-international/web-sdk-maps';
import { PlaceFinder } from "@/tom-tom/place-finder";
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
export default function RideCreator(){
    const {data:hash,writeContract,error,writeContractAsync} = useWriteContract()

    const [value, onChange] = useState<Value>(new Date());
    
    const [searchResults,setSearchResults] = useState([]);

const mapElement = useRef();
var loc;

const myFilter = (textValue: string, inputValue: string) => {
    if (inputValue.length === 0) {
      return true;
    }

    // Normalize both strings so we can slice safely
    // take into account the ignorePunctuation option as well...
    textValue = textValue.normalize("NFC").toLocaleLowerCase();
    inputValue = inputValue.normalize("NFC").toLocaleLowerCase();

    return textValue.slice(0, inputValue.length) === inputValue;
  };
  
useEffect(() => {
   
   window.navigator.geolocation.getCurrentPosition(({coords:{latitude,longitude}})=>{
    loc= {latitude,longitude}
    let map = tt.map({
        key: "zDdTIbXIoZa6sN1Gqs2WJysenDpQ9Ild",  
        container:mapElement.current!,
        center:[longitude,latitude],
        zoom:14
      });
      return () => map.remove();
    })
  }, []);


  const searchPlaces =async (query:string)=>{
    if (query.length > 0) {
        let placeFinder = new PlaceFinder();
        let results = (await placeFinder.getNearbyPlaces(query,loc!.latitude, loc!.longitude));
        console.log(results);
        
    } 
}

    return(<>
    
    { error && (<><h1 color="danger"> Error {error?.message}</h1><br/>,</>)}
     <h1 className="text-5xl mx-8 font-mono"> Create Ride </h1> 
     <Spacer className="h-4"/>
     <center>
     <Card className="w-11/12 h-11/12">
        <CardBody className="grid grid-cols-4">
           <div >
           <Textarea
      isReadOnly
      label="Start Address"
      labelPlacement="outside"
     
      defaultValue="NextUI is a React UI library that provides a set of accessible, reusable, and beautiful components."
      className="max-w-xs"
    />
<Spacer />
<Textarea
      isReadOnly
      label="End Address"
      labelPlacement="outside"
    
      defaultValue="NextUI is a React UI library that provides a set of accessible, reusable, and beautiful components."
      className="max-w-xs"
    />
<Spacer/>
<div style={{
    width:"20vw"
}}>
<h1>Departure Time:</h1>
<Input type="datetime-local" />
</div>
<Spacer/>
<Chip color="success" variant="faded">Mercedez Benz</Chip>
<Spacer/>
<Switch defaultSelected > AC</Switch>
<Spacer/>
<Spacer/>
    <Button color="success" onClick={()=>searchPlaces("Dombivli Railway Station")}>Create Ride</Button>
           </div>
           <div>
           <Autocomplete
      className="max-w-xs"
      defaultFilter={myFilter}
      defaultItems={searchResults}
      label="Select Start Destination"
      
      variant="bordered"
    >
      {(item:any) => <AutocompleteItem key={item.poi.name}>{item.poi.name}</AutocompleteItem>}
    </Autocomplete>
    <Spacer className="h-5"/>
    <Autocomplete
      className="max-w-xs"
      defaultFilter={myFilter}
      defaultItems={searchResults}
      label="Select End Destination"
      
      variant="bordered"
    >
      {(item:any) => <AutocompleteItem key={item.poi.name}>{item.poi.name}</AutocompleteItem>}
    </Autocomplete>
           </div>
          
          <div ref={mapElement} className="mapDiv col-span-2"  ></div>
          
        </CardBody>
    </Card>
        </center>      
       
    </>
    
    );

}