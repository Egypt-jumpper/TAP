"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { injected } from "wagmi/connectors";
import { sidraChain } from "@/lib/web3/sidra";
import { useState } from "react";

const config = createConfig({
  chains: [sidraChain],
  connectors: [injected()],
  transports: { [sidraChain.id]: http("https://node.sidrachain.com/") },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return <WagmiProvider config={config}><QueryClientProvider client={queryClient}>{children}</QueryClientProvider></WagmiProvider>;
}
