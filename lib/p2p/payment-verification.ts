import type { Address, PublicClient } from "viem";
import { getPaymentNetwork } from "./networks";

const transferAbi={type:"event",name:"Transfer",inputs:[
 {indexed:true,name:"from",type:"address"},{indexed:true,name:"to",type:"address"},{indexed:false,name:"value",type:"uint256"}
]} as const;

export async function verifyEvmUsdtPayment(
 publicClient:PublicClient,networkId:string,txHash:`0x${string}`,
 expectedTo:Address,expectedAmount:bigint,expectedFrom?:Address
){
 const n=getPaymentNetwork(networkId);
 if(!n?.enabled||n.kind!=="evm"||!n.usdtContract) throw new Error("Unsupported or unconfigured USDT payment network.");
 const receipt=await publicClient.getTransactionReceipt({hash:txHash});
 if(receipt.status!=="success") return {valid:false,reason:"Transaction failed.",confirmations:0,amount:0n,network:networkId,token:n.usdtContract};
 const current=await publicClient.getBlockNumber();
 const confirmations=Number(current-receipt.blockNumber)+1;
 const tx=await publicClient.getTransaction({hash:txHash});
 if(tx.to?.toLowerCase()!==n.usdtContract.toLowerCase()) return {valid:false,reason:"Transaction does not target the configured USDT contract.",confirmations,amount:0n,network:networkId,token:n.usdtContract};
 if(expectedFrom&&tx.from.toLowerCase()!==expectedFrom.toLowerCase()) return {valid:false,reason:"Sender mismatch.",confirmations,amount:0n,network:networkId,token:n.usdtContract};
 const logs=await publicClient.getLogs({address:n.usdtContract as Address,event:transferAbi,fromBlock:receipt.blockNumber,toBlock:receipt.blockNumber});
 const matches=logs.filter((x:any)=>x.args?.to?.toLowerCase()===expectedTo.toLowerCase()&&(!expectedFrom||x.args?.from?.toLowerCase()===expectedFrom.toLowerCase()));
 const amount=matches.reduce((sum:any,x:any)=>sum+(x.args?.value??0n),0n);
 const valid=amount>=expectedAmount&&confirmations>=n.confirmations;
 return {valid,reason:valid?undefined:amount<expectedAmount?"USDT amount is insufficient.":`Waiting for confirmations: ${confirmations}/${n.confirmations}.`,confirmations,amount,network:networkId,token:n.usdtContract};
}
