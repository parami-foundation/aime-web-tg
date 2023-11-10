import { AIME_CONTRACT } from "@/constants/global";
import { useModel } from "@umijs/max";
import { EthereumClient } from "@web3modal/ethereum";
import { useEffect, useState } from "react";
import { GetContractResult, getContract } from "wagmi/actions";

export default () => {
  const { ethereumClient } = useModel("useWagmi");
  const [aimePowersV3, setAimePowersV3] =
    useState<GetContractResult<any, EthereumClient>>();

  useEffect(() => {
    const aimePowersV3 = getContract({
      address: `0x${AIME_CONTRACT.Goerli.Powers}`,
      abi: require("@/abis/AIMePowersV3.json"),
      walletClient: ethereumClient,
    });

    setAimePowersV3(aimePowersV3);
  }, []);

  return {
    aimePowersV3,
  };
};
