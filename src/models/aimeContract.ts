import { AIME_CONTRACT } from "@/constants/global";
import { useModel } from "@umijs/max";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { GetContractResult, getContract } from "wagmi/actions";

export default () => {
  const { ethereumClient } = useModel("wagmiClient");
  const [aimeAMAContract, setAimeAMAContractAddress] =
    useState<GetContractResult<any, unknown>>();

  const { isConnected } = useAccount();

  console.log("isConnected", isConnected);

  useEffect(() => {
    const contract = getContract({
      address: `0x${AIME_CONTRACT.AMA}`,
      abi: require("@/abis/AIMeAMA.json"),
      walletClient: ethereumClient,
    });
    setAimeAMAContractAddress(contract);
  }, []);

  console.log("aimeAMAContract", aimeAMAContract);

  return aimeAMAContract;
};
