import { NextRequest } from "next/server";
import mongoPromise from '@/lib/mongo';
import { WithId } from "mongodb";
async function POST(req:NextRequest){
    let {start,end} = await req.json()
    //Get rides in that interval
    const db = (await mongoPromise).db("peercab");
    let intervalStart =Date.parse(start);
    let intervalEnd = Date.parse(end);
    var cur = db.collection("rides")
    .find({
        $where: function () {
            let dt = Date.parse(this.depart) ;
            return  intervalStart <= dt && dt <= intervalEnd;
        }
        
    }).map(doc=>doc._id);
    for await (const rideId of cur){
                console.log("rideId",rideId);
    }
    

}