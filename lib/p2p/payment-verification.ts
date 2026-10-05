import type { Address, PublicClient } from "viem";
import { getPaymentNetwork } from "./networks";
export async function verifyEvmUsdtPayment(publicClient:PublicClient,networkId:string,txHash:`0x${string}`,expectedTo:Address,expectedAmount:bigint,expectedFrom?:Address){
 const n=getPaymentNetwork(networkId);
 if(!n?.enabled||n.kind!=="evm"||!n.usdtContract) throw new Error("Unsupported USDT payment network.");
 const r=await publicClient.getTransactionReceipt({hash:txHash});
 if(r.status!=="success") return {valid:false,reason:"Transaction failed.",confirmations:0,amount:0n};
 const block=await publicClient.getBlockNumber(); const confirmations=Number(block-r.blockNumber)+1;
 const tx=await publicClient.getTransaction({hash:txHash});
 if(expectedFrom&&tx.from.toLowerCase()!==expectedFrom.toLowerCase()) return {valid:false,reason:"Sender mismatch.",confirmations,amount:0n};
 const logs=await publicClient.getLogs({address:n.usdtContract as Address,event:{type:"event",name:"Transfer",inputs:[{indexed:true,name:"from",type:"address"},{indexed:true,name:"to",type:"address"},{indexed:false,name:"value",type:"uint256"}]},fromBlock:r.blockNumber,toBlock:r.blockNumber});
 const m=logs.find((x:any)=>x.args?.to?.toLowerCase()===expectedTo.toLowerCase()&&(!expectedFrom||x.args?.from?.toLowerCase()===expectedFrom.toLowerCase()));
 const amount=m?.args?.value??0n;
 return {valid:Boolean(m&&amount>=expectedAmount),reason:m&&amount>=expectedAmount?undefined:"Matching USDT transfer not found or amount insufficient.",confirmations,amount,network:networkId,token:n.usdtContract};
}