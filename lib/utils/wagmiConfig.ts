// lib/wagmiConfig.ts
"use client";

import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";
// Proper wagmi config for Batua + Injected Wallets
// export const config = createConfig({
//   chains: [sepolia],
//   connectors: [injected()],
//   transports: {
//     [sepolia.id]: http("https://1rpc.io/sepolia"),
//   },
// });
export const buildbearSandboxUrl =
  "https://rpc.buildbear.io/cooing-daredevil-0ece5ad2";

const BBSandboxNetwork = /*#__PURE__*/ defineChain({
  id: 0xaa36a7,
  name: "BuildBear x ETH Sepolia Sandbox", // name your network
  nativeCurrency: { name: "BBETH", symbol: "BBETH", decimals: 18 }, // native currency of forked network
  rpcUrls: {
    default: {
      http: [buildbearSandboxUrl],
    },
  },
  blockExplorers: {
    default: {
      name: "BuildBear x Polygon Mainnet Scan", // block explorer for network
      url: "https://explorer.buildbear.io/cooing-daredevil-0ece5ad2",
      apiUrl: "https://api.buildbear.io/cooing-daredevil-0ece5ad2/api",
    },
  },
});

export const config = getDefaultConfig({
  appName: "Batua Demo",
  projectId: process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID,
  //   chains: [BBSandboxNetwork, mainnet],
  chains: [sepolia, mainnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
