import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireWallet } from "@/lib/auth/require-wallet";
import { addSda } from "@/lib/p2p/usdt-amount";
import { assertTransition } from "@/lib/p2p/state";

export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 if(!process.env.DATABASE_URL)return NextResponse.json({error:"DATABASE_URL is not configured."},{status:503});
 const {id}=await params; const body=await req.json(); const wallet=await requireWallet();
 try{
  const result=await db.$transaction(async (tx: Prisma.TransactionClient)=>{
   const order=await tx.order.findUnique({where:{id},include:{ad:true,buyer:true,seller:true}});
   if(!order)throw new Error("ORDER_NOT_FOUND");
   if(order.buyer.walletAddress!==wallet&&order.seller.walletAddress!==wallet)throw new Error("FORBIDDEN");
   assertTransition(order.status,"CANCELLED");
   await tx.ad.update({where:{id:order.adId},data:{availableAmount:addSda(order.ad.availableAmount,order.amount),active:true}});
   return tx.order.update({where:{id},data:{status:"CANCELLED"}});
  },{isolationLevel:"Serializable"});
  return NextResponse.json({order:result});
 }catch(e){const code=(e as Error).message;return NextResponse.json({error:code},{status:code==="ORDER_NOT_FOUND"?404:code==="FORBIDDEN"?403:409});}
}