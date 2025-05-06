// lib/wagmiConfig.ts
"use client";

import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// Proper wagmi config for Batua + Injected Wallets
export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http("https://1rpc.io/sepolia"),
  },
});
