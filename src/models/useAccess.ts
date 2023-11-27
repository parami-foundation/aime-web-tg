import { BIND_WALLET_MESSAGE } from "@/constants/global";
import { OauthTelegram } from "@/services/api";
import { useModel } from "@umijs/max";
import { message } from "antd";
import { useEffect, useState } from "react";

export default () => {
  const { telegramDataString, telegramAuthType } = useModel("useTelegram");
  const [address, setAddress] = useState<`0x${string}` | undefined>();
  const [signature, setSignature] = useState<string>();
  const [accessToken, setAccessToken] = useState<string>();
  const [accessTokenExpire, setAccessTokenExpire] = useState<number>(0);
  const [twitterBinded, setTwitterBinded] = useState<boolean>(true);
  const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (!!telegramDataString && !accessToken) {
        const { response, data } = await OauthTelegram({
          init_data: telegramDataString,
          message: BIND_WALLET_MESSAGE,
          signature: signature,
          address: address,
          type: telegramAuthType,
        });

        if (response?.status === 200 && data?.status === "success") {
          message.success({
            key: "bindTelegram",
            content: "Bind telegram success",
          });
          !!data?.access_token &&
            localStorage.setItem("aime:accessToken", data?.access_token);
          !!data?.access_token && setAccessToken(data?.access_token);

          !!data?.expire &&
            localStorage.setItem(
              "aime:accessToken:expire",
              data?.expire.toString()
            );
          !!data?.expire && setAccessTokenExpire(data?.expire);
        } else {
          message.error({
            key: "bindTelegram",
            content: "Bind telegram failed",
          });
        }
      }
    })();
  }, [telegramDataString, accessToken]);

  useEffect(() => {
    const accessToken = localStorage.getItem("aime:accessToken");
    const accessTokenExpire = localStorage.getItem("aime:accessToken:expire");
    const now = new Date().getTime();
    if (!accessTokenExpire || parseInt(accessTokenExpire) * 1000 < now) {
      setAccessToken(undefined);
      setAccessTokenExpire(0);
      localStorage.removeItem("aime:accessToken");
      localStorage.removeItem("aime:accessToken:expire");
    }
    if (!!accessToken) {
      setAccessToken(accessToken);
    }
    if (!!accessTokenExpire) {
      setAccessTokenExpire(parseInt(accessTokenExpire));
    }
  }, []);

  useEffect(() => {
    if (!!address) {
      localStorage.setItem("aime:address", address);
    }
  }, [address]);

  return {
    signature,
    accessToken,
    accessTokenExpire,
    address,
    twitterBinded,
    walletModalOpen,
    setAccessToken,
    setSignature,
    setAccessTokenExpire,
    setAddress,
    setTwitterBinded,
    setWalletModalOpen,
  };
};
