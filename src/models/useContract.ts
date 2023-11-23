import { AIME_CONTRACT } from "@/constants/global";
import { useModel } from "@umijs/max";
import { EthereumClient } from "@web3modal/ethereum";
import React, { useMemo } from "react";
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
      address: `0x${AIME_CONTRACT.Goerli.Powers}`,
      abi: require("@/abis/AIMePowers.json"),
      walletClient: ethereumClient,
    });

    setAIMePowers(AIMePowers);
  }, []);

  const storeTransactionHash = useMemo(() => {
    return (hash: `0x${string}`, status: "pending" | "success" | "error") => {
      setTransactionHashs((transactionHashs) => {
        return transactionHashs.set(hash, {
          hash,
          status,
          time: new Date().getTime(),
        });
      });
      localStorage.setItem(
        "aime:transactionHashs",
        JSON.stringify(Array.from(transactionHashs.entries()))
      );
    };
  }, [transactionHashs]);

  useEffect(() => {
    const transactionHashs = localStorage.getItem("aime:transactionHashs");
    if (!!transactionHashs) {
      setTransactionHashs(new Map(JSON.parse(transactionHashs)));
    }
  }, []);

  return {
    AIMePowers,
    transactionHashs,
    setTransactionHashs,
    storeTransactionHash,
  };
};
