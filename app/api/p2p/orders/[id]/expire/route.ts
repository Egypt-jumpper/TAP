import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function POST(_:Request,{params}:{params:Promise<{id:string}>}){
 if(!process.env.DATABASE_URL)return NextResponse.json({error:"DATABASE_URL is not configured."},{status:503});
 const {id}=await params;
 const result=await db.$transaction(async tx=>{
  const order=await tx.order.findUnique({where:{id}});
  if(!order)return null;
  if(order.expiresAt&&order.expiresAt>new Date())throw new Error("NOT_EXPIRED");
  if(!["CREATED","FUNDED","ACCEPTED","PAYMENT_PENDING"].includes(order.status))return order;
  await tx.ad.update({where:{id:order.adId},data:{availableAmount:{increment:0},active:true}});
  const ad=await tx.ad.findUnique({where:{id:order.adId}});
  if(ad)await tx.ad.update({where:{id:ad.id},data:{availableAmount:String(Number(ad.availableAmount)+Number(order.amount)),active:true}});
  return tx.order.update({where:{id},data:{status:"EXPIRED"}});
 });
 if(!result)return NextResponse.json({error:"ORDER_NOT_FOUND"},{status:404});
 return NextResponse.json({order:result});
}
