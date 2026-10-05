"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useConnect, useDisconnect, useSignMessage, useSwitchChain } from "wagmi";
import { sidraChain } from "@/lib/web3/sidra";

function shortAddress(address?: string) {
  return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";
}

export function WalletConnect() {
  const { address, isConnected, isConnecting, isReconnecting, chainId, connector } = useAccount();
  const { connectors, connect, error: connectError, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: switching } = useSwitchChain();
  const [open, setOpen] = useState(false);
  const [verified, setVerified] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { signMessageAsync, isPending: signing } = useSignMessage();

  const { data: nativeBalance, isLoading: balanceLoading, isError: balanceError } = useBalance({
    address,
    chainId: sidraChain.id,
    query: { enabled: Boolean(address && chainId === sidraChain.id) },
  });

  const metaMask = useMemo(
    () => connectors.find((item) => item.id === "metaMask" || item.name.toLowerCase().includes("metamask")),
    [connectors],
  );
  const walletConnectConnector = useMemo(
    () => connectors.find((item) => item.id === "walletConnect"),
    [connectors],
  );

  useEffect(() => {
    setVerified(Boolean(isConnected && address && connector && chainId === sidraChain.id && !balanceError));
  }, [isConnected, address, connector, chainId, balanceError]);

  if (!isConnected) {
    return (
      <div className="wallet-picker">
        <button
          className="button primary"
          disabled={isPending || isConnecting || isReconnecting}
          onClick={() => {
            if (metaMask) {
              connect({ connector: metaMask });
            } else {
              setOpen(true);
            }
          }}
        >
          {isPending ? "Connecting…" : "Connect MetaMask"}
        </button>
        <button className="button" onClick={() => setOpen((value) => !value)} disabled={isPending}>
          Other wallets
        </button>
        {open && (
          <div className="wallet-menu">
            {walletConnectConnector ? (
              <button
                className="wallet-option"
                onClick={() => connect({ connector: walletConnectConnector })}
                disabled={isPending}
              >
                WalletConnect — choose your wallet
              </button>
            ) : (
              <div className="wallet-hint">
                WalletConnect is not configured yet. Add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to enable the wallet picker.
              </div>
            )}
            {connectError && <div className="wallet-error">{connectError.message}</div>}
          </div>
        )}
      </div>
    );
  }

  if (chainId !== sidraChain.id) {
    return (
      <div className="wallet-picker">
        <button className="button primary" disabled={switching} onClick={() => switchChain({ chainId: sidraChain.id })}>
          {switching ? "Switching…" : "Switch to Sidra"}
        </button>
        <button className="button" onClick={() => disconnect()}>
          Disconnect {shortAddress(address)}
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-picker">
      <div className="wallet-status" aria-live="polite">
        <span className={verified ? "wallet-dot connected" : "wallet-dot"} />
        <span>{verified ? "Wallet connected & verified" : "Checking wallet…"}</span>
        <strong>{shortAddress(address)}</strong>
        {balanceLoading ? <small>Checking SDA…</small> : nativeBalance ? <small>{Number(nativeBalance.formatted).toFixed(4)} SDA</small> : null}
      </div>
      <button className="button" onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  );
}
