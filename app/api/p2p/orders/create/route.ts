import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function POST(req:Request){
 if(!process.env.DATABASE_URL)return NextResponse.json({error:"DATABASE_URL is not configured."},{status:503});
 const b=await req.json(); for(const k of ["adId","buyerWallet","amount"])if(!b[k])return NextResponse.json({error:"Missing "+k},{status:400});
 const amount=String(b.amount);
 const result=await db.$transaction(async tx=>{
  const ad=await tx.ad.findUnique({where:{id:String(b.adId)}});
  if(!ad||!ad.active)return null;
  const available=Number(ad.availableAmount), requested=Number(amount), min=Number(ad.minAmount), max=Number(ad.maxAmount);
  if(!Number.isFinite(requested)||requested<min||requested>max||requested>available)throw new Error("Amount is outside the ad limits or available liquidity.");
  const buyer=await tx.user.upsert({where:{walletAddress:String(b.buyerWallet).toLowerCase()},update:{},create:{walletAddress:String(b.buyerWallet).toLowerCase()}});
  if(buyer.id===ad.userId)throw new Error("Seller cannot create an order against their own ad.");
  await tx.ad.update({where:{id:ad.id},data:{availableAmount:String(available-requested),active:available-requested>0}});
  return tx.order.create({data:{adId:ad.id,buyerId:buyer.id,sellerId:ad.userId,amount,price:ad.price,status:"CREATED",expiresAt:new Date(Date.now()+Number(b.paymentWindowMinutes||30)*60000)}});
 });
 if(!result)return NextResponse.json({error:"Ad not found or inactive."},{status:404});
 return NextResponse.json({order:result},{status:201});
}
