import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 if(!process.env.DATABASE_URL)return NextResponse.json({error:"DATABASE_URL is not configured."},{status:503});
 const {id}=await params; const body=await req.json(); const wallet=String(body.walletAddress||"").toLowerCase();
 try{
  const result=await db.$transaction(async tx=>{
   const order=await tx.order.findUnique({where:{id},include:{ad:true,buyer:true,seller:true}});
   if(!order)throw new Error("ORDER_NOT_FOUND");
   if(order.buyer.walletAddress!==wallet&&order.seller.walletAddress!==wallet)throw new Error("FORBIDDEN");
   if(!["CREATED","FUNDED","ACCEPTED","PAYMENT_PENDING"].includes(order.status))throw new Error("ORDER_NOT_CANCELLABLE");
   const ad=await tx.ad.update({where:{id:order.adId},data:{availableAmount:String(Number(order.ad.availableAmount)+Number(order.amount)),active:true}});
   const updated=await tx.order.update({where:{id},data:{status:"CANCELLED"}});
   return {order:updated,ad};
  });
  return NextResponse.json(result);
 }catch(e){
  const code=(e as Error).message; const status=code==="ORDER_NOT_FOUND"?404:code==="FORBIDDEN"?403:400;
  return NextResponse.json({error:code},{status});
 }
}
