import { NextRequest, NextResponse } from "next/server";
import mongoPromise from '@/lib/mongo';
import { WithId } from "mongodb";
import { inRange } from "@/lib/map-utils";
export async function POST(req:NextRequest){
    let {start,end,sloc,eloc,range} = await req.json();
    console.log("post-man-test",JSON.stringify({start,end,sloc,eloc,range}));
    
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
        console.log("Ride in Interval ",{_id,ride,geojson});
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
         console.log("added-p-d",JSON.stringify({pickupPoint,dropPoint}));
         
            relatedRides.push({_id,ride,pickupPoint,dropPoint})
        }
    }
    
    return NextResponse.json(relatedRides);
    
}


