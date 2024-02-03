import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from '@/lib/mongo'
import { ObjectId } from "mongodb";

export async function GET(req:NextRequest){
    const userAddress = req.nextUrl.searchParams.get("ua")!;
    const active = req.nextUrl.searchParams.get("active");

    const db = (await mongoClientPromise).db("peercab");

    var res =  db.collection("rides")
    .find({          
        $where() {
            if(active){
                return (userAddress in this.ride.users) && this.ride.status=="ongoing";
            }
           return (userAddress in this.ride.users)
        },
    })


   return NextResponse.json(await res.toArray())
}

export async function PATCH(req:NextRequest){
 
    const db = (await mongoClientPromise).db("peercab");
    const compltedRideId = req.nextUrl.searchParams.get("mark-completed")!;
    
        let res = await db.collection("rides")
    .updateOne({          
        _id:new ObjectId(compltedRideId)
    },{
            $set:{"ride.status":"completed"}
    })
    return NextResponse.json(res);
}

