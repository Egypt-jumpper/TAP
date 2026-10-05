import { NextResponse } from "next/server";
import { web3Config } from "@/lib/web3/config";
import { USDT_NETWORKS } from "@/lib/p2p/networks";

export async function GET(){
 return NextResponse.json({
  ok:true,service:"taskmorph-ai-power",chainId:web3Config.chainId,
  tapConfigured:Boolean(web3Config.tapToken),routerConfigured:Boolean(web3Config.dexRouter),
  databaseConfigured:Boolean(process.env.DATABASE_URL),
  authConfigured:Boolean(process.env.AUTH_SESSION_SECRET),
  walletConnectConfigured:Boolean(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID),
  escrowConfigured:Boolean(process.env.ESCROW_CONTRACT_ADDRESS),
  aiConfigured:Boolean(process.env.AI_API_KEY&&process.env.AI_API_URL),
  usdtNetworks:USDT_NETWORKS.map(n=>({id:n.id,enabled:n.enabled,confirmations:n.confirmations}))
 });
}
