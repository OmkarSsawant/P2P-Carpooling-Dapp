import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from '@/lib/mongo'
import { ObjectId } from "mongodb";
//ua is must

export async function GET(req:NextRequest){
    const userAddress = req.nextUrl.searchParams.get("ua")!;
    const active = req.nextUrl.searchParams.get("active");
    const compltedRideId = req.nextUrl.searchParams.get("mark-completed");


    const db = (await mongoClientPromise).db("peercab");
    
    if(compltedRideId){
        let res = await db.collection("rides")
    .updateOne({          
        _id:new ObjectId(compltedRideId)
    },{
            $set:{"ride.status":"completed"}
    })
    return NextResponse.json(res);
}
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

