import { NETWORK_CONFIG } from "@/constants/global";
import { BindWallet, BindWalletNonce } from "@/services/api";
import { useEffect, useState } from "react";
import { useModel } from "@umijs/max";

export default () => {
  const { telegramCloudStorage } = useModel("useTelegram");

  const [address, setAddress] = useState<`0x${string}` | undefined>();
  const [signature, setSignature] = useState<string>();
  const [nonce, setNonce] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [walletModalVisible, setWalletModalVisible] = useState<boolean>(false);
  const [walletBinded, setWalletBinded] = useState<boolean>(false);

  const getBindWalletNonce = async ({
    address,
    accessToken,
  }: {
    address: `0x${string}` | undefined;
    accessToken: string;
  }) => {
    if (!address || !accessToken) {
      return {
        nonce: undefined,
        message: undefined,
        error: "Get nonce failed",
      };
    }

    const { response, data } = await BindWalletNonce(
      {
        chain_id: NETWORK_CONFIG.chains[0].id.toString(),
        address: address,
      },
      accessToken
    );

    if (response?.status === 200) {
      setNonce(data?.nonce);
      setMessage(data?.message);

      return {
        nonce: data?.nonce,
        message: data?.message,
      };
    } else {
      return {
        nonce: undefined,
        message: undefined,
        error: "Get nonce failed",
      };
    }
  };

  const bindWallet = async ({
    nonce,
    address,
    signature,
    accessToken,
  }: {
    nonce: string;
    address: `0x${string}` | undefined;
    signature: string;
    accessToken: string;
  }) => {
    if (!nonce || !address || !signature || !accessToken) {
      return {
        error: "Bind wallet failed",
        error_description: "Missing parameters",
      };
    }
    const { response, data } = await BindWallet(
      {
        chain_id: NETWORK_CONFIG.chains[0].id.toString(),
        address: address,
        signature: signature,
      },
      nonce,
      accessToken
    );

    if (response?.status === 200 || response?.status === 204) {
      return null;
    } else {
      return data;
    }
  };

  useEffect(() => {
    if (!!address) {
      localStorage.setItem("aime:address", address);
      telegramCloudStorage?.set("aime:address", address);
    }
  }, [address]);

  useEffect(() => {
    (async () => {
      const address =
        localStorage.getItem("aime:address") ||
        (await telegramCloudStorage?.get("aime:address"));
      if (!!address) {
        setAddress(address as `0x${string}`);
      }
    })();
  }, []);

  return {
    message,
    nonce,
    address,
    setAddress,
    signature,
    setSignature,
    walletModalVisible,
    setWalletModalVisible,
    getBindWalletNonce,
    walletBinded,
    setWalletBinded,
    bindWallet,
  };
};
