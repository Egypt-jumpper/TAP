import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { addSda } from "@/lib/p2p/usdt-amount";
import { assertTransition } from "@/lib/p2p/state";

export async function POST(_:Request,{params}:{params:Promise<{id:string}>}){
 if(!process.env.DATABASE_URL)return NextResponse.json({error:"DATABASE_URL is not configured."},{status:503});
 const {id}=await params;
 try{
  const result=await db.$transaction(async tx=>{
   const order=await tx.order.findUnique({where:{id},include:{ad:true}});
   if(!order)throw new Error("ORDER_NOT_FOUND");
   if(!order.expiresAt||order.expiresAt>new Date())throw new Error("NOT_EXPIRED");
   if(!["CREATED","FUNDED","ACCEPTED","PAYMENT_PENDING"].includes(order.status))return order;
   assertTransition(order.status,"EXPIRED");
   await tx.ad.update({where:{id:order.adId},data:{availableAmount:addSda(order.ad.availableAmount,order.amount),active:true}});
   return tx.order.update({where:{id},data:{status:"EXPIRED"}});
  },{isolationLevel:"Serializable"});
  return NextResponse.json({order:result});
 }catch(e){const code=(e as Error).message;return NextResponse.json({error:code},{status:code==="ORDER_NOT_FOUND"?404:409});}
}