import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from '@/lib/mongo'
import { ObjectId } from "mongodb";

export async function GET(req:NextRequest){
    const userAddress = req.nextUrl.searchParams.get("ua")!;
    const active = req.nextUrl.searchParams.get("active");

    const db = (await mongoClientPromise).db("peercab");
    const filter = {
        'ride.users' : {$elemMatch : {'userId':{$eq:userAddress}}}       
     }
    var res =  db.collection("rides")
    .find(active ? {
        ...filter,
        "status":"ongoing"
    }:filter)


   return NextResponse.json(await res.toArray())
}


export async function PATCH(req:NextRequest){
 
        const activeRideId = req.nextUrl.searchParams.get("dropped-ride-id")!;
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

