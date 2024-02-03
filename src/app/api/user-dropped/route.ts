import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from '@/lib/mongo'
import { ObjectId } from "mongodb";
//ua is must

export async function PATCH(req:NextRequest){
    const activeRideId = req.nextUrl.searchParams.get("ride-id")!;
    const db = (await mongoClientPromise).db("peercab");
    
     await db.collection("rides")
    .updateOne({          
        _id:new ObjectId(activeRideId)
    },{
            $inc:{'ride.seats':-1}
    })
    let seats =(await db.collection("rides")
    .find({          
        _id:new ObjectId(activeRideId)
    }).toArray())[0].ride.seats;
  
    return NextResponse.json({"droppedAllUsers":seats==0});

}

