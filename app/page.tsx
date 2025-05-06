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

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/utils/wagmiConfig";

import { erc20Abi } from "viem";
import Link from "next/link";
import { waitForUserOperationReceipt } from "viem/account-abstraction";
import { waitForCallsStatus } from "viem/experimental";

export default function BatuaPage() {
  //   const { connect, connectors } = useConnect();
  const account = useAccount();

  const { data: callStatus, sendCallsAsync } = useSendCalls({
    config,
  });

  const { data: callReceipts } = useWaitForCallsStatus({
    id: callStatus?.id,
  });

  const [hasMounted, setHasMounted] = useState(false);
  const [batchTxUrl, setBatchTxUrl] = useState("");

  const executeBatchTx = async () => {
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
        // {
        //   to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        //   value: parseEther("0.0001"),
        // },
      ],
    });
    console.log(res.id);

    console.log(callReceipts);
    if (callReceipts?.status == "success")
      setBatchTxUrl(
        `https://sepolia.etherscan.io/tx/${callReceipts?.receipts[0].transactionHash}`
      );
  };

  useEffect(() => {
    // Preload Batua when component mounts
    setupBatua();
    setHasMounted(true); // ✅ Now we are sure we're client-side
  }, []);

  // ⛔ Important fix: Don't render anything until mounted
  if (!hasMounted) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-8">
      <h1 className="text-4xl">Welcome to the Batua Dapp</h1>

      {!account.isConnected ? (
        // <button
        //   onClick={createBatuaAndConnect}
        //   className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        // >
        //   Create Batua & Connect
        // </button>
        <ConnectButton onClick={setupBatua} />
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <ConnectButton />
          <button
            onClick={executeBatchTx}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Send Batch Transaction
          </button>

          {callReceipts && callReceipts.status == "pending" && (
            <p className="text-yellow-500">Executing...</p>
          )}
          {callReceipts && callReceipts.status == "failure" && (
            <p className="text-yellow-500">Execution Failed</p>
          )}
          {callReceipts && callReceipts.status && (
            <p className="text-green-500">
              Execution Successful
              <br />
              <Link
                target="_blank"
                href={`https://sepolia.etherscan.io/tx/${callReceipts.receipts[0].transactionHash}`}
                className="font-bold underline break-words"
              >
                {`https://sepolia.etherscan.io/tx/${callReceipts.receipts[0].transactionHash}`}
              </Link>
            </p>
          )}
        </div>
      )}
    </main>
  );
}
