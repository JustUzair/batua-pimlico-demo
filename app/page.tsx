"use client";

import { setupBatua } from "@/lib/utils/batuaClient";
import { useAccount, useConnect } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { useSendCalls, useWaitForCallsStatus } from "wagmi";
import { encodeFunctionData, parseUnits, parseEther } from "viem";
import {
  TEST_ERC20_TOKEN_ADDRESS,
  randomAddressOne,
  //   randomAddressTwo,
} from "@/lib/constants";
import { config } from "@/lib/utils/wagmiConfig";

import { erc20Abi } from "viem";

export default function BatuaPage() {
  const { connect, connectors } = useConnect();
  const account = useAccount();

  const { data: callStatus, sendCallsAsync } = useSendCalls({
    config,
  });
  const { data: callReceipts } = useWaitForCallsStatus({ id: callStatus?.id });

  const [batuaCreated, setBatuaCreated] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Preload Batua when component mounts
    setupBatua();
    setHasMounted(true); // ✅ Now we are sure we're client-side
  }, []);

  const createBatuaAndConnect = useCallback(async () => {
    setupBatua();

    const injectedConnector = connectors.find(c => c.id === "injected");
    if (!injectedConnector) {
      console.error("No injected connector found");
      return;
    }

    await connect({ connector: injectedConnector });

    // After successful connection
    setBatuaCreated(true);
  }, [connect, connectors]);

  const callSucceeded = callReceipts?.status === "success";
  const callPending = callReceipts?.status === "pending";

  // ⛔ Important fix: Don't render anything until mounted
  if (!hasMounted) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-8">
      <h1 className="text-4xl">Welcome to the Batua Dapp</h1>

      {!account.isConnected ? (
        <button
          onClick={createBatuaAndConnect}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create Batua & Connect
        </button>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-green-600 text-lg">
            Connected as: {account.address}
          </p>

          {batuaCreated && (
            <p className="text-blue-500 text-lg">
              ✅ Batua wallet created and connected successfully!
            </p>
          )}

          <button
            onClick={async () => {
              const res = await sendCallsAsync({
                account: account.address,
                chainId: account.chainId,
                calls: [
                  {
                    to: TEST_ERC20_TOKEN_ADDRESS,
                    data: encodeFunctionData({
                      abi: erc20Abi,
                      functionName: "approve",
                      args: [randomAddressOne, parseUnits("1", 6)],
                    }),
                  },
                  {
                    to: TEST_ERC20_TOKEN_ADDRESS,
                    data: encodeFunctionData({
                      abi: erc20Abi,
                      functionName: "transfer",
                      args: [randomAddressOne, parseUnits("1", 6)],
                    }),
                  },
                  //   {
                  //     to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
                  //     value: parseEther("1"),
                  //   },
                ],
              });
              console.log(res);
            }}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Send Batch Transaction
          </button>

          {callPending && (
            <p className="text-yellow-500">Transaction Pending...</p>
          )}

          {callSucceeded && (
            <p className="text-green-500">
              Transaction Successful! Hash:{" "}
              {callReceipts?.receipts?.[0]?.transactionHash}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
