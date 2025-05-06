// lib/batuaClient.ts
"use client";

import { Batua } from "@/lib/batua";
import { http } from "viem";
import { sepolia } from "viem/chains";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { entryPoint07Address } from "viem/account-abstraction";
const pimlicoApiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY!;

export const buildbearSandboxUrl =
  "https://rpc.buildbear.io/cooing-daredevil-0ece5ad2";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pimlicoClient = createPimlicoClient({
  transport: http(buildbearSandboxUrl),
  entryPoint: {
    address: entryPoint07Address,
    version: "0.7",
  },
});
// initialize Batua manually
export function setupBatua() {
  {
    const res = Batua.create({
      rpc: {
        transports: {
          [sepolia.id]: http("https://1rpc.io/sepolia"),
        },
      },
      paymaster: {
        transports: {
          [sepolia.id]: http(
            `https://api.pimlico.io/v2/${sepolia.id}/rpc?apikey=${pimlicoApiKey}`
          ),
        },
        //   context: {
        //     sponsorshipPolicyId: process.env.NEXT_PUBLIC_SPONSORSHIP_POLICY_ID,
        //   },
      },

      bundler: {
        transports: {
          [sepolia.id]: http(
            `https://api.pimlico.io/v2/${sepolia.id}/rpc?apikey=${pimlicoApiKey}`
          ),
        },
      },
    });
    console.log(`Batua Created \n`, res);
  }
}
