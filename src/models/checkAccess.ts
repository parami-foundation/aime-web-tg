import { OauthTelegram } from "@/service/api";
import { useModel } from "@umijs/max";
import { message } from "antd";
import { useEffect, useState } from "react";

export default () => {
  const {
    telegramData,
    telegramDataString,
    setTelegramData,
    setTelegramDataString,
    setTelegramAuthType,
  } = useModel("tmaInitData");
  const [binded, setBinded] = useState<boolean>(true);
  const [signature, setSignature] = useState<string>("");
  const [bindedTwitter, setBindedTwitter] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (!!telegramDataString) {
        OauthTelegram({
          init_data: telegramDataString,
        }).then((res) => {
          if (res?.response?.code === 200 && res?.data?.status === "success") {
            message.success({
              key: "bindTelegram",
              content: "Bind telegram success",
            });
            !!res?.data?.access_token &&
              localStorage.setItem("aime:accessToken", res?.data?.access_token);
            !!res?.data?.access_token &&
              setAccessToken(res?.data?.access_token);
            !!res?.data?.expire &&
              localStorage.setItem(
                "aime:accessToken:expire",
                res?.data?.expire
              );
          }
        });
      }
    })();
  }, [telegramDataString]);

  return {
    binded,
    signature,
    bindedTwitter,
    accessToken,
    setAccessToken,
    setBinded,
    setSignature,
    setBindedTwitter,
  };
};
