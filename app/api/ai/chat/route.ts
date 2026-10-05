import { NextResponse } from "next/server";
import { generateChat } from "@/lib/ai/provider";
import { readSession,sessionCookieName } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST(req:Request){
 try{
  const session=readSession((await cookies()).get(sessionCookieName)?.value);
  if(!session)return NextResponse.json({error:"Wallet authentication required."},{status:401});
  const body=await req.json(); const messages=Array.isArray(body.messages)?body.messages:[];
  if(!messages.length||messages.length>50)return NextResponse.json({error:"messages must contain 1-50 items."},{status:400});
  const safe=messages.filter((m:any)=>m&&["system","user","assistant"].includes(m.role)&&typeof m.content==="string").map((m:any)=>({role:m.role,content:m.content.slice(0,12000)}));
  const result=await generateChat(safe);
  if(process.env.DATABASE_URL)await db.aIUsage.create({data:{walletAddress:session.walletAddress,promptTokens:Number(result.usage?.prompt_tokens||0),completionTokens:Number(result.usage?.completion_tokens||0),totalTokens:Number(result.usage?.total_tokens||0)}});
  return NextResponse.json(result);
 }catch(e){return NextResponse.json({error:(e as Error).message},{status:503});}
}
