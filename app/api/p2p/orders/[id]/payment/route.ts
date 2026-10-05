import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWallet } from "@/lib/auth/require-wallet";
import { getUsdtPublicClient } from "@/lib/p2p/clients";
import { verifyEvmUsdtPayment } from "@/lib/p2p/payment-verification";
import { parseUsdt } from "@/lib/p2p/usdt-amount";
import { assertTransition } from "@/lib/p2p/state";

export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 if(!process.env.DATABASE_URL)return NextResponse.json({error:"DATABASE_URL is not configured."},{status:503});
 const {id}=await params;
 try{
  const b=await req.json(); const txHash=String(b.txHash||""); const wallet=await requireWallet();
  if(!txHash||!wallet)return NextResponse.json({error:"walletAddress and txHash are required."},{status:400});
  const order=await db.order.findUnique({where:{id},include:{buyer:true,seller:true}});
  if(!order)return NextResponse.json({error:"ORDER_NOT_FOUND"},{status:404});
  if(order.buyer.walletAddress!==wallet)return NextResponse.json({error:"Only the buyer can submit USDT payment proof."},{status:403});
  if(!["CREATED","FUNDED","ACCEPTED","PAYMENT_PENDING"].includes(order.status))return NextResponse.json({error:"ORDER_NOT_PAYABLE",status:order.status},{status:409});
  const expectedAmount=parseUsdt(order.paymentAmount);
  const client=getUsdtPublicClient(order.paymentNetwork);
  const result=await verifyEvmUsdtPayment(client,order.paymentNetwork,txHash as `0x${string}`,order.paymentReceiver as `0x${string}`,expectedAmount,order.buyer.walletAddress as `0x${string}`);
  if(!result.valid){
   await db.order.update({where:{id},data:{paymentTxHash:txHash,paymentConfirmations:result.confirmations,paymentVerificationReason:result.reason,status:"PAYMENT_PENDING"}});
   return NextResponse.json({verification:"failed",...result},{status:422});
  }
  assertTransition(order.status,"PAYMENT_SENT");
  const updated=await db.order.update({where:{id},data:{paymentTxHash:txHash,paymentSender:order.buyer.walletAddress,paymentConfirmations:result.confirmations,paymentVerificationReason:null,paymentVerifiedAt:new Date(),status:"PAYMENT_SENT"}});
  return NextResponse.json({verification:"verified",order:updated,amount:result.amount.toString(),confirmations:result.confirmations});
 }catch(e){return NextResponse.json({error:(e as Error).message},{status:400});}
}