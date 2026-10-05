import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPaymentNetwork } from "@/lib/p2p/networks";
import { requireWallet } from "@/lib/auth/require-wallet";
import { parseSda, parseUsdt } from "@/lib/p2p/usdt-amount";

export async function GET(){
 if(!process.env.DATABASE_URL)return NextResponse.json({ads:[],configured:false});
 const ads=await db.ad.findMany({where:{active:true},orderBy:{createdAt:"desc"}});
 return NextResponse.json({ads,configured:true});
}

export async function POST(req:Request){
 if(!process.env.DATABASE_URL)return NextResponse.json({error:"DATABASE_URL is not configured."},{status:503});
 try{
  const b=await req.json(); const authenticatedWallet=await requireWallet();
  for(const k of ["walletAddress","side","price","availableAmount","minAmount","maxAmount","paymentNetwork","paymentMethods"])if(!b[k])return NextResponse.json({error:`Missing ${k}`},{status:400});
  if(b.side!=="BUY"&&b.side!=="SELL")return NextResponse.json({error:"side must be BUY or SELL."},{status:400});
  const network=getPaymentNetwork(String(b.paymentNetwork));
  if(!network?.enabled||!network.usdtContract)return NextResponse.json({error:"Selected USDT network is not configured for verified payments."},{status:400});
  parseUsdt(String(b.price)); parseSda(String(b.availableAmount)); parseSda(String(b.minAmount)); parseSda(String(b.maxAmount));
  const wallet=authenticatedWallet;
  const user=await db.user.upsert({where:{walletAddress:wallet},update:{},create:{walletAddress:wallet}});
  const ad=await db.ad.create({data:{
   userId:user.id,side:b.side,asset:"SDA",price:String(b.price),availableAmount:String(b.availableAmount),
   minAmount:String(b.minAmount),maxAmount:String(b.maxAmount),paymentAsset:"USDT",paymentNetwork:network.id,
   paymentTokenContract:network.usdtContract,paymentMethods:JSON.stringify(b.paymentMethods),terms:b.terms?String(b.terms):null,
   paymentWindowMinutes:Math.max(5,Math.min(1440,Number(b.paymentWindowMinutes||30)))
  }});
  return NextResponse.json({ad},{status:201});
 }catch(e){return NextResponse.json({error:(e as Error).message},{status:400});}
}