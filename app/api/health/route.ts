import { NextResponse } from "next/server";
import { web3Config } from "@/lib/web3/config";
export async function GET(){
 return NextResponse.json({ok:true,service:"taskmorph-ai-power",chainId:web3Config.chainId,tapConfigured:Boolean(web3Config.tapToken),routerConfigured:Boolean(web3Config.dexRouter)});
}
