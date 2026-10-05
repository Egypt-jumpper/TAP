"use client";
import Link from "next/link";
import { WalletConnect } from "@/components/wallet-connect";
import { TokenBalance } from "@/components/token-balance";
import { useAccount } from "wagmi";
export default function SwapPage(){
 const {isConnected}=useAccount();
 return <main className="container">
  <nav className="nav"><Link href="/">TAP</Link><div><Link href="/dashboard">Dashboard</Link><Link href="/p2p">P2P</Link><WalletConnect/></div></nav>
  <section className="hero"><span className="eyebrow">ON-CHAIN SWAP</span><h1>Swap</h1><p>Sidra Chain wallet and token state are connected. Router execution remains disabled until its verified contract address and ABI are configured.</p><WalletConnect/>{isConnected&&<TokenBalance/>}</section>
  <div className="card"><h3>Execution safety</h3><p>Quotes, allowance, approval, slippage, minimum received, fees, gas and transaction confirmation will be surfaced before signing. No unverified router address is hard-coded.</p></div>
 </main>;
}
