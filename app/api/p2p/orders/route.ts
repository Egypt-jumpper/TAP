import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWallet } from "@/lib/auth/require-wallet";
const ACTIVE=["CREATED","FUNDED","ACCEPTED","PAYMENT_PENDING","PAYMENT_SENT","SELLER_CONFIRMING","DISPUTED"] as const;
export async function GET(req:Request){
 if(!process.env.DATABASE_URL)return NextResponse.json({orders:[],configured:false});
 const wallet=new URL(req.url).searchParams.get("wallet")?.toLowerCase();
 if(!wallet)return NextResponse.json({error:"wallet is required"},{status:400});
 const user=await db.user.findUnique({where:{walletAddress:wallet}});
 if(!user)return NextResponse.json({orders:[],configured:true});
 const orders=await db.order.findMany({where:{OR:[{buyerId:user.id},{sellerId:user.id}]},include:{ad:true},orderBy:{createdAt:"desc"}});
 return NextResponse.json({orders,activeStatuses:ACTIVE,configured:true});
}
