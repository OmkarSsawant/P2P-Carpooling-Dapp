import { NextRequest, NextResponse } from "next/server";
import mongoPromise from '@/lib/mongo';
import { WithId } from "mongodb";
async function POST(req:NextRequest){
    let {start,end,sloc,eloc,range} = await req.json();
    //Get rides in that interval
    const db = (await mongoPromise).db("peercab");
    let intervalStart =Date.parse(start);
    let intervalEnd = Date.parse(end);
    var cur = db.collection("rides")
    .find({
        $where: function () {
            let dt = Date.parse(this.depart) ;
            return  intervalStart <= dt && dt <= intervalEnd;
        }
        
    });
    const relatedRides = [];
    for await (const {_id,ride,geojson} of cur){
        var pickupPoint,dropPoint ;
        for (var pp of geojson){
            if(!pickupPoint && inRange(sloc,pp,range)){
                pickupPoint = pp;
            }
            if(pickupPoint){
                if(inRange(eloc,pp,range)){
                    dropPoint = pp;
                    break;
                }
            }
        }
        if(pickupPoint && dropPoint){
            relatedRides.push({_id,ride,pickupPoint,dropPoint})
        }
    }
    return NextResponse.json(relatedRides);
    
}


function getDistanceFromLatLonInKm(point1, point2) {
    function convertDegToRad(value:number) { return value * Math.PI / 180 }
    const [lat1, lon1] = point1;
    const [lat2, lon2] = point2;
    const earthRadius = 6371;
    const dLat = convertDegToRad(lat2 - lat1);
    const dLon = convertDegToRad(lon2 - lon1);
    const squarehalfChordLength =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(convertDegToRad(lat1)) * Math.cos(convertDegToRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const angularDistance = 2 * Math.atan2(Math.sqrt(squarehalfChordLength), Math.sqrt(1 - squarehalfChordLength));
    const distance = earthRadius * angularDistance;
    return distance;
  
  }
function inRange(l1:any,l2:any,km:number){
    const dist = getDistanceFromLatLonInKm([l1.latitude,l1.longitude],[l2.latitude,l2.longitude])
    return dist <= km;
}