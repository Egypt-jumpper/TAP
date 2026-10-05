import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createPublicClient,http } from "viem";
import { sidraChain } from "@/lib/web3/sidra";
import { buildFundCall,verifyEscrowFunding } from "@/lib/p2p/escrow";
import { assertTransition } from "@/lib/p2p/state";
function sidraClient(){return createPublicClient({chain:sidraChain,transport:http(process.env.NEXT_PUBLIC_SIDRA_RPC_URL||"https://node.sidrachain.com/")});}
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 if(!process.env.DATABASE_URL)return NextResponse.json({error:"DATABASE_URL is not configured."},{status:503});
 const {id}=await params;
 try{
  const b=await req.json(); const wallet=String(b.walletAddress||"").toLowerCase(); const txHash=String(b.txHash||"");
  const order=await db.order.findUnique({where:{id},include:{buyer:true,seller:true}});
  if(!order)return NextResponse.json({error:"ORDER_NOT_FOUND"},{status:404});
  if(order.seller.walletAddress!==wallet)return NextResponse.json({error:"Only the SDA seller can fund escrow."},{status:403});
  if(order.status!=="CREATED"&&order.status!=="ACCEPTED")return NextResponse.json({error:"ORDER_NOT_FUNDABLE",status:order.status},{status:409});
  if(!txHash)return NextResponse.json({transaction:buildFundCall(id,order.buyer.walletAddress,order.amount),orderId:id,amount:order.amount});
  const result=await verifyEscrowFunding(sidraClient(),txHash,id,order.seller.walletAddress,order.buyer.walletAddress,order.amount);
  if(!result.valid)return NextResponse.json({verification:"failed",...result},{status:422});
  assertTransition(order.status,"FUNDED");
  const updated=await db.order.update({where:{id},data:{escrowContract:process.env.ESCROW_CONTRACT_ADDRESS,escrowTxHash:txHash,escrowOrderId:id,status:"FUNDED"}});
  return NextResponse.json({verification:"verified",order:updated});
 }catch(e){return NextResponse.json({error:(e as Error).message},{status:400});}
}
