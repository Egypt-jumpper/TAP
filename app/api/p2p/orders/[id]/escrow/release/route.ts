import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWallet } from "@/lib/auth/require-wallet";
import { createPublicClient,http,encodeFunctionData,decodeFunctionData } from "viem";
import { sidraChain } from "@/lib/web3/sidra";
import { ESCROW_ABI,escrowOrderId } from "@/lib/p2p/escrow";
import { assertTransition } from "@/lib/p2p/state";
function client(){return createPublicClient({chain:sidraChain,transport:http(process.env.NEXT_PUBLIC_SIDRA_RPC_URL||"https://node.sidrachain.com/")});}
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 if(!process.env.DATABASE_URL||!process.env.ESCROW_CONTRACT_ADDRESS)return NextResponse.json({error:"Escrow is not configured."},{status:503});
 const {id}=await params; const b=await req.json(); const wallet=await requireWallet(); const txHash=String(b.txHash||"");
 try{
  const order=await db.order.findUnique({where:{id},include:{buyer:true,seller:true}}); if(!order)return NextResponse.json({error:"ORDER_NOT_FOUND"},{status:404});
  if(order.buyer.walletAddress!==wallet&&order.seller.walletAddress!==wallet)return NextResponse.json({error:"FORBIDDEN"},{status:403});
  if(order.status!=="SELLER_CONFIRMING")return NextResponse.json({error:"ESCROW_NOT_RELEASEABLE",status:order.status},{status:409});
  if(!txHash)return NextResponse.json({transaction:{to:process.env.ESCROW_CONTRACT_ADDRESS,data:encodeFunctionData({abi:ESCROW_ABI,functionName:"release",args:[escrowOrderId(id)]})}});
  const receipt=await client().getTransactionReceipt({hash:txHash}); if(receipt.status!=="success"||receipt.to?.toLowerCase()!==process.env.ESCROW_CONTRACT_ADDRESS.toLowerCase())return NextResponse.json({error:"ESCROW_RELEASE_FAILED"},{status:422});
  const tx=await client().getTransaction({hash:txHash}); const decoded=decodeFunctionData({abi:ESCROW_ABI,data:tx.input}); if(decoded.functionName!=="release"||String(decoded.args[0]).toLowerCase()!==escrowOrderId(id).toLowerCase())return NextResponse.json({error:"ESCROW_CALL_MISMATCH"},{status:422});
  assertTransition(order.status,"COMPLETED"); const updated=await db.order.update({where:{id},data:{status:"COMPLETED"}}); return NextResponse.json({verification:"verified",order:updated});
 }catch(e){return NextResponse.json({error:(e as Error).message},{status:400});}
}
