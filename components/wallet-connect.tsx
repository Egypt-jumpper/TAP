"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { sidraChain } from "@/lib/web3/sidra";

export function WalletConnect() {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: switching } = useSwitchChain();

  if (!isConnected) {
    const connector = connectors[0];
    return <button className="button primary" disabled={!connector || isPending} onClick={() => connector && connect({ connector })}>Connect Wallet</button>;
  }
  if (chainId !== sidraChain.id) {
    return <button className="button primary" disabled={switching} onClick={() => switchChain({ chainId: sidraChain.id })}>Switch to Sidra</button>;
  }
  return <button className="button" onClick={() => disconnect()}>{address?.slice(0,6)}…{address?.slice(-4)}</button>;
}
