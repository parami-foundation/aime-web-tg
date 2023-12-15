import { AIME_CONTRACT } from "@/constants/global";
import { useModel } from "@umijs/max";
import { EthereumClient } from "@web3modal/ethereum";
import React from "react";
import { useEffect, useState } from "react";
import { GetContractResult, getContract } from "wagmi/actions";

export default () => {
  const { ethereumClient } = useModel("useWagmi");
  const [AIMePowers, setAIMePowers] =
    useState<GetContractResult<any, EthereumClient>>();
  const [transactionHashs, setTransactionHashs] = React.useState<
    Map<
      `0x${string}`,
      {
        hash?: `0x${string}`;
        status?: "pending" | "success" | "error";
        message?: string;
        time?: number;
      }
    >
  >(new Map());

  useEffect(() => {
    const AIMePowers = getContract({
      address: `0x${AIME_CONTRACT.Optimism.Powers}`,
      abi: require("@/abis/AIMePowers.json"),
      walletClient: ethereumClient,
    });

    setAIMePowers(AIMePowers);
  }, []);

  return {
    AIMePowers,
    transactionHashs,
    setTransactionHashs,
  };
};
