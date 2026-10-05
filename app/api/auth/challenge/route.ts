import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";

export async function POST(req:Request){
 if(!process.env.DATABASE_URL)return NextResponse.json({error:"DATABASE_URL is not configured."},{status:503});
 const body=await req.json(); const wallet=String(body.walletAddress||"").toLowerCase();
 if(!/^0x[a-f0-9]{40}$/.test(wallet))return NextResponse.json({error:"Invalid wallet address."},{status:400});
 const recent=await db.authNonce.count({where:{walletAddress:wallet,createdAt:{gt:new Date(Date.now()-10*60*1000)}}});
 if(recent>=5)return NextResponse.json({error:"Too many login challenges. Try again later."},{status:429});
 const nonce=randomUUID(); const expiresAt=new Date(Date.now()+5*60*1000);
 await db.authNonce.create({data:{walletAddress:wallet,nonce,expiresAt}});
 const message="TaskMorph AI Power wallet login\n\nWallet: "+wallet+"\nNonce: "+nonce+"\nExpires: "+expiresAt.toISOString();
 return NextResponse.json({message,nonce,expiresAt});
}
