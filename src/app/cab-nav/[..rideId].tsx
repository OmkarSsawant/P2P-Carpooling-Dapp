import tt from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";

import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react";

export default function CabNav(){
    const {rideId} = useRouter().query;
    const [map,setMap] = useState<tt.Map|undefined>()

const mapElement = useRef();
const [dist,setDist] = useState(0)

    useEffect(()=>{
        window.navigator.geolocation.getCurrentPosition(({coords:{latitude,longitude}})=>{
            
            let  map = tt.map({
                key: "zDdTIbXIoZa6sN1Gqs2WJysenDpQ9Ild",  
                container:mapElement.current!,
                center:[longitude,latitude],
                zoom:14
              });
              setMap(map)
            })
            loadDriverActiveRide()
            return () => map?.remove();
    },[])


    
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
    console.log("Route Drawn");
      
    }
    



    async function loadDriverActiveRide() {
        const res = await fetch(`/api/driver-rides/byrideId/${rideId}`)
        const results = await res.json()
        if(results.length!=0){

                const {ride} = results[0];

                showRoute(ride.start,ride.end,map!)
            //Place Markers

                for(var {userId,pickupPoint,dropPoint} of ride.users){
                    const pe = document.createElement('div');
                    pe.id = 'pickup-marker';
                     let pickPopUp = new tt.Popup({
        className:"card",
        closeOnClick:true,
        closeButton:true,
      }).setText(userId);
      let pm = new tt.Marker({element:pe})
      .setLngLat({lat:pickupPoint.latitude!,lng:pickupPoint.longitude!})
      .addTo(map!)
      .setPopup(pickPopUp);
                
         let dropPopUp = new tt.Popup({
          className:"card",
          closeOnClick:true,
          closeButton:true,
        }).setText(userId);

        const ee = document.createElement('div');
        ee.id = 'drop-marker';
   let dm = new tt.Marker({element:ee})
          .setLngLat({lat:dropPoint.latitude!,lng:dropPoint.longitude!})
          .addTo(map!)
          .setPopup(dropPopUp);
    }

    map!.easeTo({
        center:[pickupPoint.longitude!,pickupPoint.latitude!]
    })
        }
    }

    return (<>
          <div ref={mapElement} />
    </>)
}