import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from '@/lib/mongo'
import { ObjectId } from "mongodb";
//da is must
//Reads the active rides of driver
export async function GET(req:NextRequest){
    const rideId = req.nextUrl.searchParams.get("ride-id")!;
    const db = (await mongoClientPromise).db("peercab");
    var res =  db.collection("rides")
    .find({_id:new ObjectId(rideId)})


   return NextResponse.json(await res.toArray())
}
