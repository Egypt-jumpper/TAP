"use client";
import Link from "next/link";
import { WalletConnect } from "@/components/wallet-connect";
import { TokenBalance } from "@/components/token-balance";
import { useAccount, useBalance } from "wagmi";
export default function Dashboard(){
 const {address}=useAccount();
 const {data}=useBalance({address});
 return <main className="container">
  <nav className="nav"><Link href="/">TAP</Link><div><Link href="/swap">Swap</Link><Link href="/p2p">P2P</Link><WalletConnect/></div></nav>
  <section className="hero"><span className="eyebrow">ACCOUNT</span><h1>Dashboard</h1><p>Wallet-connected overview for your Sidra Chain account.</p><WalletConnect/></section>
  <div className="grid">
   <div className="card"><h3>Wallet</h3><p>{address ? address : "Not connected"}</p><TokenBalance/><p className="muted">Native SDA: {data ? Number(data.formatted).toLocaleString(undefined,{maximumFractionDigits:4}) : "—"}</p></div>
   <div className="card"><h3>On-chain first</h3><p>Balances and network state are read from Sidra Chain. No fake transaction data is displayed.</p></div>
  </div>
 </main>;
}
