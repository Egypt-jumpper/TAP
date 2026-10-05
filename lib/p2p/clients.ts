import { createPublicClient, http } from "viem";
import { mainnet, bsc } from "viem/chains";
import { getPaymentNetwork } from "./networks";

export function getUsdtPublicClient(networkId:string){
 const n=getPaymentNetwork(networkId);
 if(!n?.enabled||n.kind!=="evm"||!n.rpcUrl) throw new Error("USDT network is not configured for on-chain verification.");
 const chain=n.chainId===1?mainnet:n.chainId===56?bsc:undefined;
 if(!chain) throw new Error("Unsupported EVM payment network.");
 return createPublicClient({chain,transport:http(n.rpcUrl)});
}
