import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 if(!process.env.DATABASE_URL)return NextResponse.json({error:"DATABASE_URL is not configured."},{status:503});
 const {id}=await params; const b=await req.json(); const txHash=String(b.txHash||""); const network=String(b.network||"");
 if(!txHash||!network)return NextResponse.json({error:"network and txHash are required."},{status:400});
 const order=await db.order.findUnique({where:{id},include:{buyer:true,seller:true,ad:true}});
 if(!order)return NextResponse.json({error:"ORDER_NOT_FOUND"},{status:404});
 if(!["CREATED","FUNDED","ACCEPTED","PAYMENT_PENDING"].includes(order.status))return NextResponse.json({error:"ORDER_NOT_PAYABLE",status:order.status},{status:409});
 // This endpoint records the submitted proof only. A worker/server verifier must validate the tx on the selected USDT network before PAYMENT_SENT.
 const updated=await db.order.update({where:{id},data:{paymentTxHash:txHash,status:"PAYMENT_PENDING"}});
 return NextResponse.json({order:updated,verification:"pending",network,warning:"Do not release escrow until on-chain verification succeeds."});
}
