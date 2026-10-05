import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyMessage } from "viem";
import { db } from "@/lib/db";
import { createSession,sessionCookieName } from "@/lib/auth/session";

export async function POST(req:Request){
 if(!process.env.DATABASE_URL||!process.env.AUTH_SESSION_SECRET)return NextResponse.json({error:"Authentication is not configured."},{status:503});
 try{
  const b=await req.json(); const wallet=String(b.walletAddress||"").toLowerCase(); const signature=String(b.signature||"");
  if(!/^0x[a-f0-9]{40}$/.test(wallet)||!signature)return NextResponse.json({error:"walletAddress and signature are required."},{status:400});
  const nonce=await db.authNonce.findFirst({where:{walletAddress:wallet,usedAt:null,expiresAt:{gt:new Date()}},orderBy:{createdAt:"desc"}});
  if(!nonce)return NextResponse.json({error:"No valid login challenge."},{status:401});
  const message="TaskMorph AI Power wallet login\n\nWallet: "+wallet+"\nNonce: "+nonce.nonce+"\nExpires: "+nonce.expiresAt.toISOString();
  const valid=await verifyMessage({address:wallet as `0x${string}`,message,signature:signature as `0x${string}`});
  if(!valid)return NextResponse.json({error:"Invalid wallet signature."},{status:401});
  const claimed=await db.authNonce.updateMany({where:{id:nonce.id,usedAt:null},data:{usedAt:new Date()}});
  if(claimed.count!==1)return NextResponse.json({error:"Challenge already used."},{status:401});
  await db.user.upsert({where:{walletAddress:wallet},update:{},create:{walletAddress:wallet}});
  const session=createSession(wallet); const jar=await cookies();
  jar.set(sessionCookieName,session.value,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",expires:session.expires,path:"/"});
  return NextResponse.json({authenticated:true,walletAddress:wallet});
 }catch(e){return NextResponse.json({error:(e as Error).message},{status:400});}
}
