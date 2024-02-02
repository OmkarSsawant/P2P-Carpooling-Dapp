import { usePrepareTransactionRequest, useReadContract, useWriteContract } from "wagmi"
import {abi} from '@/abi/Carpooling.json';
import { Key, MouseEventHandler, useEffect, useRef, useState } from "react";
import { Autocomplete, AutocompleteItem, AutocompleteSection, Avatar, Button, Card, CardBody, CardFooter, Chip, Divider, Input, Popover, PopoverContent, PopoverTrigger, Slider, Spacer, Switch, Tab, Tabs, Textarea } from "@nextui-org/react";
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import tt, { LngLat, Point } from '@tomtom-international/web-sdk-maps';
import tts from '@tomtom-international/web-sdk-services'
import { PlaceFinder } from "@/tom-tom/place-finder";
import { compressRoute, splitLine } from "@/lib/map-utils";

import Image from "next/image";

export  function CabBooker(){
    const {data:hash,error,writeContractAsync} = useWriteContract()

  
    
    const [loc,setLoc] = useState({"latitude":0,"longitude":0})
    const [searchResults,setSearchResults] = useState([]);
    const [searchResults2,setSearchResults2] = useState([]);
    const [range,setRange] = useState(1);

    const [startPlace,setStartPlace] = useState<any|undefined>()
    const [endPlace,setEndPlace] = useState<any|undefined>()
    const [map,setMap] = useState<tt.Map|undefined>()
    const [geojson,setGeoJson] = useState("")
    const [selectedRide,setSelectedRide]  = useState<any|undefined>()

const mapElement = useRef();
const dateTimeInput = useRef();
const edateTimeInput = useRef();

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

 async function showRoute(sp:any,ep:any,m:tt.Map) {
console.log(sp,ep,m);

  if(!sp  || !ep || !m) return; 
console.log("Route Calculating ...");

  
    var res =await  tts.services.calculateRoute({
      locations:`${sp.position.lon},${sp.position.lat}:${ep.position.lon},${ep.position.lat}`,
       traffic:false,
       key:"zDdTIbXIoZa6sN1Gqs2WJysenDpQ9Ild"
     })
     
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

const findRides:MouseEventHandler<HTMLButtonElement> = async ev => {
  ev.preventDefault();

  var res =  await fetch('/api/relevant-rides',{
      method:"POST",
      body:JSON.stringify({
          "sloc":{"latitude":startPlace.position.lat,"longitude":startPlace.position.lon},
          "eloc":{"latitude":endPlace.position.lat,"longitude":endPlace.position.lon},
          "start":Date.parse((dateTimeInput!.current! as any).value),
          "end":Date.parse((edateTimeInput!.current! as any).value),
          range
      })
    }) 

    

    let relevantRides :[]=await res.json(); 
    console.log('RELEVANT-RIDES',relevantRides,map);
    
    for (var {_id,ride,pickupPoint,dropPoint} of relevantRides){
      console.log(_id,pickupPoint,dropPoint);
      
      const pe = document.createElement('div');
      pe.id = 'pickup-marker';
      pe.addEventListener('click',ev=>{
        // setSelectedRide({_id,ride,pickupPoint,dropPoint})
          console.log("selected",{_id,ride,pickupPoint,dropPoint});
          
      })
      // const puPopUpElement = document.createElement('div');
      // puPopUpElement.innerHTML = `
      // <h1> ${_id} </h1>
      // <button onclick=${()=>console.log("Will Work",dropPoint)}> show drop point </button>
      // `;

      // let pickPopUp = new tt.Popup({
      //   className:"card",
      //   closeOnClick:true,
      //   closeButton:true,
      // }).setDOMContent(puPopUpElement);
      let pm = new tt.Marker({element:pe})
        .setLngLat({lat:pickupPoint.latitude!,lng:pickupPoint.longitude!})
        .addTo(map!)
        // .setPopup(pickPopUp);


        // const dpPopUpElement = document.createElement('div');
        // puPopUpElement.innerHTML = `
        // <h1> ${_id} </h1>
        // <button onclick=${()=>console.log("Will Work",dropPoint)}> show drop point </button>
        // `;
  
        // let dropPopUp = new tt.Popup({
        //   className:"card",
        //   closeOnClick:true,
        //   closeButton:true,
        // }).setDOMContent(dpPopUpElement);

      const ee = document.createElement('div');
     
      ee.id = 'drop-marker';
 let dm = new tt.Marker({element:ee})
        .setLngLat({lat:dropPoint.latitude!,lng:dropPoint.longitude!})
        .addTo(map!)
        // .setPopup(dropPopUp);
        
    }
  }
  

 async function bookRide() {
  console.log("booking Ride",JSON.stringify(selectedRide));
 const txn =  await writeContractAsync({
    address:"0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi,
    functionName:"addUserToRide",
    args:[
      selectedRide.driverAddress,
      selectedRide.rideId 
    ],
    value:selectedRide.ride.fare
  })
  alert(`
    Successfully Booked Cab ${txn}
  `)
  }

    return(<>
    
    { error && (<><h1 color="danger"> Error {error?.message}</h1><br/>,</>)}
     <h1 className="text-5xl mx-8 font-mono"> Find Peer Cab </h1> 
     <Spacer className="h-4"/>
     <center>
     <Card className="w-11/12 h-11/12">
        <CardBody className="grid grid-cols-7">
           <div className="col-span-2" >
       
<Spacer/>

   
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
    <Spacer className="h-2"/>
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
    <Spacer/>
    <Spacer className="h-5"/>
    <div style={{
    width:"20vw"
}}>
<h1>Arrival  Time From:</h1>
<Input  ref={dateTimeInput} type="datetime-local" />
</div>
<Spacer/>
<div style={{
    width:"20vw"
}}>
<h1>Arrival  Time Till:</h1>
<Input  ref={edateTimeInput} type="datetime-local" />
</div>
<Spacer className="h-5"/>

<div style={{
    width:"20vw"
}}>


<Slider   
        size="md"
        step={5}
        color="foreground"
        label={`Select Walk Distance : ${range} km`}
        showSteps={true} 
        maxValue={30} 
        minValue={1} 
        value={range}
        defaultValue={5}
        onChange={setRange}
        className="max-w-md" 
      />
</div>

    <Spacer className="h-10"/>
    <Button color="success" onClick={findRides}>Find</Button>
    <Spacer className="h-10"/>
   
           </div>

           {selectedRide && 
           <div className="col-span-2 mr-10">
            <center>
              <Card isBlurred >
                <CardBody>
           


    <Spacer className="h-2"/>

<Textarea
            isReadOnly
            label="Starts From"
            value={selectedRide?.ride?.start?.address?.freeformAddress}
            />
      <Spacer/><Spacer/>
      <Textarea
            isReadOnly
            label="Ends At"
            value={selectedRide?.ride?.end?.address?.freeformAddress}
            />
      <Spacer/><Spacer/>
      <Divider/>
      <Button   onClick={()=>{
                    if(selectedRide)
                    map?.easeTo({
                      center:[selectedRide?.pickupPoint.longitude,selectedRide?.pickupPoint.latitude]
                    })
                  }
                  } color="success" startContent={<Image alt="pi" width={30} height={30} src="/assets/pickup.svg"/>}>
        Show Pickup Point
      </Button>  
            <Spacer/><Spacer/>
            <Button   onClick={()=>{
                    if(selectedRide)
                    map?.easeTo({
                      center:[selectedRide?.dropPoint.longitude,selectedRide?.dropPoint.latitude]
                    })
                  }
                  } color="success" startContent={<Image alt="ei" width={30} height={30} src="/assets/taxi-stop.png"/>}>
        Show Drop Stop
      </Button>   
           
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
      {selectedRide?.ride?.fare/10**18}  Eth 
      </Chip>
           
      </div>
    <Spacer className="h-2"/>

                </CardBody>
             <CardFooter>
              <center>
              <Button onClick={bookRide} color="success"> Book </Button>
              </center>
             </CardFooter>
              </Card>
            </center>
          
           </div>
           }
         
          <div ref={mapElement} className={`mapDiv col-span-3`}>
        
          </div>
          

        </CardBody>
    </Card>
        </center>      
       
    </>
    
    );

}