import { NextRequest } from "next/server";
import mongoClientPromise from '@/lib/mongo';
import { NextResponse } from "next/server";
import { createClient } from 'redis';

// const client = createClient();

// client.on('error', (err:any) => console.log('Redis Client Error', err));
// (async function () {
//     await client.connect();
//     console.log("---------------- CONNECTED REDIS -----------------");
    
// })();
export  async function POST(req:NextRequest){
    let {ride,geojson}= await req.json()
    console.log(ride,geojson);
    geojson = JSON.parse(geojson)
   console.log(typeof geojson,typeof geojson[0]);
   console.log(geojson);
   
    const db = (await mongoClientPromise).db("peercab");
    var res = await db.collection("rides")
    .insertOne({ride,geojson});
    // var geoset = []
    // for(var g of geojson){
    //     g.member = `ride:${res.insertedId}`
    //     geoset.push(g)
    // }
    // console.log("got GEOSET",geoset);
    
//Upload Route to redis with key  routes:_id of mongo
// await client.geoAdd(`routes:${res.insertedId}`,geoset);
console.log("check",`routes:${res.insertedId}`);

    return NextResponse.json({"HURRAY":"UNDERSTOOD ",res})
}
