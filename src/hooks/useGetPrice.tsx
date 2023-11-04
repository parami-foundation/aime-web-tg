import { AIME_CONTRACT } from "@/constants/global";
import { useContractRead } from "wagmi";

export const getBuyPrice = async ({
  powerAddress,
  amount,
}: {
  powerAddress: string;
  amount: number;
}) => {
  const { data: price, isError, isLoading }: {
    data?: bigint;
    isError: boolean;
    isLoading: boolean;
  } = useContractRead({
    address: `0x${AIME_CONTRACT.Powers}`,
    abi: require("@/abis/AIMePowersV3.json"),
    functionName: "getBuyPrice",
    args: [powerAddress, amount],
  });

  return {
    price,
    isError,
    isLoading,
  }
};
