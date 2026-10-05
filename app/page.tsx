import Link from "next/link";
import { WalletConnect } from "@/components/wallet-connect";
export default function Home(){
 return <main className="container">
  <nav className="nav"><Link href="/"><strong>TAP</strong></Link><div><Link href="/dashboard">Dashboard</Link><Link href="/swap">Swap</Link><Link href="/p2p">P2P</Link><WalletConnect/></div></nav>
  <section className="hero"><span className="eyebrow">AI × WEB3 × SIDRA CHAIN</span><h1>TaskMorph AI Power</h1><p>Build, trade and automate with a real on-chain foundation.</p><WalletConnect/></section>
  <div className="grid">
   <div className="card"><h3>AI Chat</h3><p>Provider-agnostic AI services with server-side secrets.</p></div>
   <div className="card"><h3>On-chain Swap</h3><p>Wallet connection, balances and transaction safety before execution.</p><Link href="/swap">Open Swap →</Link></div>
   <div className="card"><h3>P2P Marketplace</h3><p>Escrow-first architecture for SDA and supported assets.</p><Link href="/p2p">Open P2P →</Link></div>
   <div className="card"><h3>AI Services</h3><p>Marketplace-ready service architecture for TAP-powered workflows.</p></div>
  </div>
 </main>;
}
