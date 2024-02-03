import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from '@/lib/mongo'
import { ObjectId } from "mongodb";
//da is must

export async function GET(req:NextRequest){
    const driverAddress = req.nextUrl.searchParams.get("da")!;
    const active = req.nextUrl.searchParams.get("active");
    const startRideId = req.nextUrl.searchParams.get("start-ride");


    const db = (await mongoClientPromise).db("peercab");
    
    if(startRideId){
        let res = await db.collection("rides")
    .updateOne({          
        _id:new ObjectId(startRideId)
    },{
            $set:{"ride.status":"ongoing"}
    })
    return NextResponse.json(res);
}
    var res =  db.collection("rides")
    .find({          
        $where() {
            if(active){
                return (driverAddress == this.ride.driverAddress) && this.ride.status=="ongoing";
            }
           return (driverAddress ==this.ride.driverAddress)
        },
    })


   return NextResponse.json(await res.toArray())
}

