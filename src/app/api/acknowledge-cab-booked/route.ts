import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from '@/lib/mongo';

export async function GET(req:NextRequest){
    let id= req.nextUrl.searchParams.get('id');
    if(!id) return;
    const db = (await mongoClientPromise).db('peercab');
    db.collection('rides')
    .updateOne({_id:id},{$inc:{seats:-1}})
    return NextResponse.json({"HURRAY":"UNDERSTOOD"})
}