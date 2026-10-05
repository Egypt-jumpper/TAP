"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { injected, metaMask, walletConnect } from "wagmi/connectors";
import { sidraChain } from "@/lib/web3/sidra";
import { useState } from "react";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const connectors = [
  metaMask(),
  injected({ shimDisconnect: true }),
  ...(walletConnectProjectId
    ? [walletConnect({ projectId: walletConnectProjectId, showQrModal: true })]
    : []),
];

export const wagmiConfig = createConfig({
  chains: [sidraChain],
  connectors,
  transports: { [sidraChain.id]: http(process.env.NEXT_PUBLIC_SIDRA_RPC_URL || "https://node.sidrachain.com/") },
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
