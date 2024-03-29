import { useAccount, usePrepareTransactionRequest, useReadContract, useWriteContract } from "wagmi"
import {abi} from '@/abi/Carpooling.json';
import { Key, useEffect, useRef, useState } from "react";
import { Autocomplete, AutocompleteItem, AutocompleteSection, Button, Card, CardBody, Chip, Divider, Input, Spacer, Switch, Tab, Tabs, Textarea } from "@nextui-org/react";
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import tt, { LngLat, Point } from '@tomtom-international/web-sdk-maps';
import tts from '@tomtom-international/web-sdk-services'
import { PlaceFinder } from "@/tom-tom/place-finder";
import { compressRoute, splitLine } from "@/lib/map-utils";
import { readContract } from "wagmi/actions";
import { config } from "@/wagmi";

export default function RideCreator(){
    const {data:hash,error,writeContractAsync} = useWriteContract()

    const car   = useReadContract({
     abi,
      address:"0x5FbDB2315678afecb367f032d93F642f64180aa3",
      functionName:"getCarDetails",  
    })
    const account = useAccount()
    const [dist,setDist] = useState(0)
    
    const [loc,setLoc] = useState({"latitude":0,"longitude":0})
    const [searchResults,setSearchResults] = useState([]);
    const [searchResults2,setSearchResults2] = useState([]);
    const [fee,setFee] = useState("");
    const [seats,setSeats] = useState("1");


    const [startPlace,setStartPlace] = useState<any|undefined>()
    const [endPlace,setEndPlace] = useState<any|undefined>()
    const [map,setMap] = useState<tt.Map|undefined>()
    const [geojson,setGeoJson] = useState("")
const mapElement = useRef();
const dateTimeInput = useRef();
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
    setLoc ({latitude,longitude})
    console.log("loc",loc);
    
    let  map = tt.map({
        key: "zDdTIbXIoZa6sN1Gqs2WJysenDpQ9Ild",  
        container:mapElement.current!,
        center:[longitude,latitude],
        zoom:14
      });
      setMap(map)
    })
    return () => map?.remove();

  }, []);


  const searchPlaces =async (query:string,setResults:Function)=>{
        let placeFinder = new PlaceFinder();
        let results = (await placeFinder.getNearbyPlaces(query,loc!.latitude, loc!.longitude));
        console.log(results);
        setResults(results)        
}

  async function createRide() {
    
  
    

    let hash = await writeContractAsync({
      abi,
      address:"0x5FbDB2315678afecb367f032d93F642f64180aa3",
      functionName:"registerRide",
      args:[
          //TODO: (car.data as any).seats,
          BigInt(seats),
          String(startPlace?.address?.freeformAddress),
          String(endPlace?.address?.freeformAddress),
          BigInt(parseFloat(fee) * 10**18),
          Date.parse((dateTimeInput!.current! as any).value),
          0
      ]  
    });
    alert(`Ride Created ${hash}`)
    const lastId = await readContract(config,{
      abi,
       address:"0x5FbDB2315678afecb367f032d93F642f64180aa3",
       functionName:"getLastRideIdOfDriver"});

    let ride = {
      "name" : (car.data as any).name,
      "seats":parseInt(seats),
      "start" : startPlace,
     "end" : endPlace,
     "driverAddress":account.address,
      "rideId":parseInt(lastId),
     "fare": Math.round(parseFloat(fee) * 10**18),
      "depart" : Date.parse((dateTimeInput!.current! as any).value),
      "reached":0,
      "status":"pending"
    }

    console.log("geojson",geojson);
    
 await  fetch('/api/create-ride',{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({ride,geojson})
  }).catch(console.error)


  }

 async function showRoute(sp:any,ep:any,m:tt.Map) {
console.log(sp,ep,m);

  if(!sp  || !ep || !m) return; 
console.log("Route Calculating ...");

  
    var res =await  tts.services.calculateRoute({
      locations:`${sp.position.lon},${sp.position.lat}:${ep.position.lon},${ep.position.lat}`,
       traffic:false,
       key:"zDdTIbXIoZa6sN1Gqs2WJysenDpQ9Ild"
     })
    setDist(res.routes[0].summary.lengthInMeters/1000)
     
    let  gj = res!.toGeoJson() 
console.log("Route Calculated");
    let waypoints = compressRoute(res!,0.1);
    console.log("waypoints",waypoints);
    setGeoJson(JSON.stringify(waypoints));
    console.log("set-geojson",geojson);
    
    m.addLayer({
      id: "route",
      type: "line",
      source: {
        type: "geojson",
        data: gj,
      },
      paint: {
        "line-color": "#00d7ff",
        "line-width": 8,
      },
    })
    var bounds = new tt.LngLatBounds()
    gj.features[0].geometry.coordinates.forEach(function (point:any) {
      // console.log(point);
      
      bounds.extend(tt.LngLat.convert(point))
    })
    m.fitBounds(bounds, { padding: 20 })
// console.log("Route Drawn");
for(const wp of waypoints){
  let e = document.createElement('div')
  e.id = 'pickup-point-marker'
  try {
    var marker = new tt.Marker({element:e})
    .setLngLat(tt.LngLat.convert([wp.longitude!,wp.latitude!])).addTo(m);
    console.log("Market Added");
  } catch (error) {
    console.log("Scan",wp);
    
  }
 
  
}
      
  }


    return(<>
    
    { error && (<><h1 color="danger"> Error {error?.message}</h1><br/>,</>)}
     <h1 className="text-6xl font-black text-gray-900 dark:text-white"> Create Ride </h1> 
     <Spacer className="h-4"/>
     <center>
     <Card className="w-11/12 h-11/12">
        <CardBody className="grid grid-cols-4">
           <div >
           <Textarea
      isReadOnly
      label="Start Address"
      labelPlacement="outside"
    value={String(startPlace?.address?.freeformAddress ?? "")}
      defaultValue=""
      className="max-w-xs"
    />
<Spacer />
<Textarea
      isReadOnly
      label="End Address"
      labelPlacement="outside"
    
      value={String(endPlace?.address?.freeformAddress ?? "")}

      className="max-w-xs"
    />
<Spacer/>
<div style={{
    width:"20vw"
}}>
<h1>Departure Time:</h1>
<Input  ref={dateTimeInput} type="datetime-local" />
</div>
<Spacer/>
{ car.isSuccess && <Chip color="success" variant="faded">{(car.data as any).name}</Chip>}
<Spacer/>
<Switch defaultSelected > AC</Switch>
<Spacer/>
<Spacer/>
    <Button color="success" onClick={createRide}>Create Ride</Button>
           </div>
           <div >
           <Spacer className="h-10"/>
   
           <Autocomplete
      className="max-w-xs dark"
      onSelectionChange={(pid:Key)=>{
        console.log(pid,(searchResults[0] as any).id);
        
        let sp = searchResults.find((v:any)=>v.id == pid.toString())
        console.log('set-start-place',sp);
        
        setStartPlace(sp)
        if(endPlace!=undefined && map!=undefined){
          showRoute(sp,endPlace,map);
        }
    }}      
      defaultFilter={myFilter}
      items={searchResults}
      label="Select Start Destination"
      onInputChange={(q)=>{
        if(q.length > 4){
            searchPlaces(q,setSearchResults)
        }
      }}
      variant="bordered"

    >
      {(item:any) =>
       <AutocompleteItem className="dark text-zinc-600" key={item.poi.id}>{item.poi.name}</AutocompleteItem>}
    </Autocomplete>
    <Spacer className="h-10"/>
    <Autocomplete
     onInputChange={(q)=>{
        if(q.length > 4){
            searchPlaces(q,setSearchResults2)
        }
      }}
        onSelectionChange={(pid:Key)=>{
            console.log(pid);
            
            let ep = searchResults2.find((v:any)=>v.id == pid.toString())
            console.log("set-end-place",ep);
            console.log("get-start-place",startPlace);
            
            setEndPlace(ep)
            if(startPlace!=undefined && map!=undefined){
              showRoute(startPlace,ep,map)
            }
        }}
      className="max-w-xs"
      defaultFilter={myFilter}
      defaultItems={searchResults2}
      label="Select End Destination"
      labelPlacement="inside"
      variant="bordered"
    >
      {(item:any) => <AutocompleteItem className="dark text-zinc-600" key={item.poi.id}>
        {item.poi.name}</AutocompleteItem>}
    </Autocomplete>
    <Spacer className="h-10"/>
    <Input className="w-4/5" type="number" label="Avaiable Seats" value={seats}   onChange={(t)=>{
              setSeats(t.currentTarget.value)
          }}/>
    <Spacer className="h-5"/>
    <Input className="w-4/5" type="number" label="Charge Per KM" value={fee}   onChange={(t)=>{
              setFee(t.currentTarget.value)
          }}/>
           </div>
          
          <div ref={mapElement} className="mapDiv col-span-2"  ></div>
          

        </CardBody>
    </Card>
        </center>      
       
    </>
    
    );

}