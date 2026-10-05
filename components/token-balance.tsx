"use client";
import { useBalance } from "wagmi";
import { TAP_TOKEN } from "@/lib/web3/addresses";
import { useAccount } from "wagmi";
export function TokenBalance(){
 const {address}=useAccount();
 const {data,isLoading}=useBalance({address,token:TAP_TOKEN});
 if(!address) return null;
 return <div className="muted">TAP balance: {isLoading ? "…" : data ? Number(data.formatted).toLocaleString(undefined,{maximumFractionDigits:4}) : "0"}</div>;
}
