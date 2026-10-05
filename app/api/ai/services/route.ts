import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function GET(){
 if(!process.env.DATABASE_URL)return NextResponse.json({services:[],configured:false});
 return NextResponse.json({services:await db.aIService.findMany({where:{active:true},orderBy:{createdAt:"desc"}}),configured:true});
}
