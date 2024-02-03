import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from '@/lib/mongo';
import { ObjectId } from "mongodb";

export async function GET(req:NextRequest){
    let id= req.nextUrl.searchParams.get('id');
    const userId = req.nextUrl.searchParams.get("user-id")!;
    if(!id) return;
    console.log('Updating Seat Count for Id And Adding user',id,userId);
    
    const db = (await mongoClientPromise).db('peercab');
  const res =  await  db.collection('rides')
  .updateOne({_id:new ObjectId(id)},{$inc:{'ride.seats':-1},$addToSet:{
    'ride.users':userId
  }})

    console.log(
    'updated-seats',
      res
  );
    //TODO: SEND NOTIFICATION FOR DRIVER THAT RIDE BOOKED BY USER_ID
   
    return NextResponse.json(res)
}