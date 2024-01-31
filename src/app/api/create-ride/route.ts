import { NextRequest } from "next/server";
import mongoClientPromise from '@/lib/mongo';
import { NextResponse } from "next/server";
import { createClient } from 'redis';

const client = createClient();

client.on('error', (err:any) => console.log('Redis Client Error', err));
(async function () {
    await client.connect();
    console.log("---------------- CONNECTED REDIS -----------------");
    
})();
export  async function POST(req:NextRequest){
    let {ride,geojson}= await req.json()
    console.log(ride);
    const db = (await mongoClientPromise).db("peercab");
    var res = await db.collection("rides")
    .insertOne(ride);
//Upload Route to redis with key  routes:_id of mongo
client.geoAdd(`routes:${res.insertedId}`,geojson);

//OPTIMI: deduce the size of route emit middle points 
    return NextResponse.json({"HURRAY":"UNDERSTOOD ",res})
}

export  function GET(req:NextRequest){
    return NextResponse.json({"HURRAY":"UNDERSTOOD"})
}