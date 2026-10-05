import Link from "next/link";
import { WalletConnect } from "@/components/wallet-connect";
export default function P2P(){
 return <main className="container"><nav className="nav"><Link href="/"><strong>TAP</strong></Link><div><Link href="/dashboard">Dashboard</Link><Link href="/swap">Swap</Link><WalletConnect/></div></nav>
 <section className="hero"><span className="eyebrow">PEER TO PEER</span><h1>SDA Marketplace</h1><p>Escrow-first P2P trading. Live advertisements will appear only after the production database and escrow contract are configured.</p><WalletConnect/></section>
 <div className="grid"><Link className="card" href="/p2p/buy"><h3>Buy SDA</h3><p>Browse verified seller advertisements.</p></Link><Link className="card" href="/p2p/sell"><h3>Sell SDA</h3><p>Create or manage sell liquidity.</p></Link><Link className="card" href="/p2p/create-ad"><h3>Create Ad</h3><p>Set price, limits and payment method.</p></Link><Link className="card" href="/p2p/orders"><h3>Orders</h3><p>Track active and completed trades.</p></Link></div>
 </main>;
}
