import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPaymentNetwork } from "@/lib/p2p/networks";
import { requireWallet } from "@/lib/auth/require-wallet";
import { formatUsdt, multiplyUsdt, parseSda, subSda } from "@/lib/p2p/usdt-amount";

export async function POST(req:Request){
 if(!process.env.DATABASE_URL)return NextResponse.json({error:"DATABASE_URL is not configured."},{status:503});
 try{
  const b=await req.json(); const adId=String(b.adId||""); const wallet=await requireWallet(); const amount=String(b.amount||"");
  if(!adId||!wallet||!amount)return NextResponse.json({error:"adId, walletAddress and amount are required."},{status:400});
  parseSda(amount);
  const result=await db.$transaction(async tx=>{
   const ad=await tx.ad.findUnique({where:{id:adId}});
   if(!ad||!ad.active)throw new Error("AD_NOT_FOUND");
   const network=getPaymentNetwork(ad.paymentNetwork);
   if(!network?.enabled||!network.usdtContract||network.usdtContract.toLowerCase()!==ad.paymentTokenContract.toLowerCase())throw new Error("PAYMENT_NETWORK_NOT_CONFIGURED");
   const requested=parseSda(amount), available=parseSda(ad.availableAmount), min=parseSda(ad.minAmount), max=parseSda(ad.maxAmount);
   if(requested<min||requested>max||requested>available)throw new Error("Amount is outside the ad limits or available liquidity.");
   const owner=await tx.user.findUnique({where:{id:ad.userId}});
   if(!owner)throw new Error("AD_OWNER_NOT_FOUND");
   const actor=await tx.user.upsert({where:{walletAddress:wallet},update:{},create:{walletAddress:wallet}});
   const buyer=ad.side==="SELL"?actor:owner; const seller=ad.side==="SELL"?owner:actor;
   if(buyer.id===seller.id)throw new Error("Self-trading is not allowed.");
   const paymentUnits=multiplyUsdt(ad.price,amount);
   await tx.ad.update({where:{id:ad.id},data:{availableAmount:subSda(ad.availableAmount,amount),active:requested<available}});
   return tx.order.create({data:{
    adId:ad.id,buyerId:buyer.id,sellerId:seller.id,amount,price:ad.price,paymentAmount:formatUsdt(paymentUnits),
    paymentAsset:"USDT",paymentNetwork:ad.paymentNetwork,paymentTokenContract:ad.paymentTokenContract,paymentReceiver:seller.walletAddress,status:"CREATED",
    expiresAt:new Date(Date.now()+ad.paymentWindowMinutes*60000)
   }});
  },{isolationLevel:"Serializable"});
  return NextResponse.json({order:result},{status:201});
 }catch(e){
  const code=(e as Error).message; const status=code==="AD_NOT_FOUND"?404:code==="PAYMENT_NETWORK_NOT_CONFIGURED"?503:400;
  return NextResponse.json({error:code},{status});
 }
}