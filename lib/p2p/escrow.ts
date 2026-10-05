import { encodeFunctionData,keccak256,toBytes } from "viem";
import type { Address,PublicClient } from "viem";
import { parseSda } from "./usdt-amount";

export const ESCROW_ABI=[
 {type:"function",name:"createAndFund",stateMutability:"nonpayable",inputs:[{name:"orderId",type:"bytes32"},{name:"buyer",type:"address"},{name:"amount",type:"uint256"}],outputs:[]},
 {type:"function",name:"markPayment",stateMutability:"nonpayable",inputs:[{name:"orderId",type:"bytes32"}],outputs:[]},
 {type:"function",name:"release",stateMutability:"nonpayable",inputs:[{name:"orderId",type:"bytes32"}],outputs:[]},
 {type:"function",name:"cancel",stateMutability:"nonpayable",inputs:[{name:"orderId",type:"bytes32"}],outputs:[]},
 {type:"function",name:"dispute",stateMutability:"nonpayable",inputs:[{name:"orderId",type:"bytes32"}],outputs:[]},
 {type:"event",name:"EscrowCreated",inputs:[{indexed:true,name:"orderId",type:"bytes32"},{indexed:true,name:"seller",type:"address"},{indexed:true,name:"buyer",type:"address"},{indexed:false,name:"amount",type:"uint256"}]}
] as const;

export function escrowOrderId(orderId:string){return keccak256(toBytes(orderId));}
export function buildFundCall(orderId:string,buyer:Address,amount:string){
 const contract=process.env.ESCROW_CONTRACT_ADDRESS as Address|undefined;
 if(!contract)throw new Error("ESCROW_CONTRACT_ADDRESS is not configured.");
 return {to:contract,data:encodeFunctionData({abi:ESCROW_ABI,functionName:"createAndFund",args:[escrowOrderId(orderId),buyer,parseSda(amount)]})};
}
export async function verifyEscrowFunding(client:PublicClient,txHash:any,orderId:string,seller:Address,buyer:Address,amount:string){
 const contract=process.env.ESCROW_CONTRACT_ADDRESS as Address|undefined;
 if(!contract)throw new Error("ESCROW_CONTRACT_ADDRESS is not configured.");
 const receipt=await client.getTransactionReceipt({hash:txHash});
 if(receipt.status!=="success")return {valid:false,reason:"Escrow funding transaction failed."};
 const logs=await client.getLogs({address:contract,event:ESCROW_ABI[5],fromBlock:receipt.blockNumber,toBlock:receipt.blockNumber});
 const id=escrowOrderId(orderId); const expected=parseSda(amount);
 const match=logs.find((x:any)=>x.args?.orderId?.toLowerCase()===id.toLowerCase()&&x.args?.seller?.toLowerCase()===seller.toLowerCase()&&x.args?.buyer?.toLowerCase()===buyer.toLowerCase()&&x.args?.amount===expected);
 return {valid:Boolean(match),reason:match?undefined:"EscrowCreated event does not match this order.",blockNumber:receipt.blockNumber};
}
