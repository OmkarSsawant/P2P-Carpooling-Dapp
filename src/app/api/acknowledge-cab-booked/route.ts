import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from '@/lib/mongo';
import { ObjectId } from "mongodb";

export async function GET(req:NextRequest){
    let id= req.nextUrl.searchParams.get('id');
    if(!id) return;
    console.log('Updating Seat Count for Id',id);
    
    const db = (await mongoClientPromise).db('peercab');
  const res =  await  db.collection('rides')
  .updateOne({_id:new ObjectId(id)},{$inc:{'ride.seats':-1}})
    console.log(
    'updated-seats',
      res
  );
    //TODO: SEND NOTIFICATION FOR DRIVER THAT RIDE BOOKED BY USER_ID
   
    //TODO: Complete Ride Logic
    return NextResponse.json(res)
}