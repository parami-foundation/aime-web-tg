import { BIND_WALLET_MESSAGE } from "@/constants/global";
import { OauthTelegram } from "@/service/api";
import { useModel } from "@umijs/max";
import { message } from "antd";
import { useEffect, useState } from "react";

export default () => {
  const { telegramDataString, telegramAuthType } = useModel("tmaInitData");
  const [address, setAddress] = useState<string>();
  const [signature, setSignature] = useState<string>();
  const [accessToken, setAccessToken] = useState<string>();
  const [accessTokenExpire, setAccessTokenExpire] = useState<number>(0);
  const [twitterBinded, setTwitterBinded] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      if (!!telegramDataString && !!signature && !!address) {
        OauthTelegram({
          init_data: telegramDataString,
          message: BIND_WALLET_MESSAGE,
          signature: signature,
          address: address,
          type: telegramAuthType,
        }).then(({ response, data }) => {
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
        });
      }
    })();
  }, [telegramDataString, signature, address]);

  useEffect(() => {
    const accessToken = localStorage.getItem("aime:accessToken");
    const accessTokenExpire = localStorage.getItem("aime:accessToken:expire");
    if (!!accessToken) {
      setAccessToken(accessToken);
    }
    if (!!accessTokenExpire) {
      setAccessTokenExpire(parseInt(accessTokenExpire));
    }
  }, []);

  return {
    signature,
    accessToken,
    accessTokenExpire,
    address,
    twitterBinded,
    setAccessToken,
    setSignature,
    setAccessTokenExpire,
    setAddress,
    setTwitterBinded,
  };
};
