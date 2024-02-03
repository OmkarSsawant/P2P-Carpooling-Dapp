import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from '@/lib/mongo'
import { ObjectId } from "mongodb";
//da is must
//Reads the active rides of driver
export async function GET(req:NextRequest){
    const driverAddress = req.nextUrl.searchParams.get("da")!;
    const active = req.nextUrl.searchParams.get("active");
    const db = (await mongoClientPromise).db("peercab");
    console.log(active);
    var res =  db.collection("rides")
    .find(active ? {  
        'ride.driverAddress': driverAddress,
        'ride.status':'ongoing'
    } : {
        'ride.driverAddress': driverAddress,
    })


   return NextResponse.json(await res.toArray())
}



export async function PATCH(req:NextRequest){
    const startRideId = req.nextUrl.searchParams.get("start-ride")!;
    const db = (await mongoClientPromise).db("peercab");
    
    let res = await db.collection("rides")
    .updateOne({          
        _id:new ObjectId(startRideId)
    },{
            $set:{"ride.status":"ongoing"}
    })
    return NextResponse.json(res);
}

export async function DELETE(req:NextRequest) {
      const rideId = req.nextUrl.searchParams.get('ride-id')!;
      const db = (await mongoClientPromise).db("peercab");
    
      let res = await db.collection("rides")
      .deleteOne({          
          _id:new ObjectId(rideId)
      })
      return NextResponse.json(res);       
}