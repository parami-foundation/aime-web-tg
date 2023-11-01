import { OauthTelegram } from "@/service/api";
import { useModel } from "@umijs/max";
import { message } from "antd";
import { useEffect, useState } from "react";

export default () => {
  const { telegramDataString } = useModel("tmaInitData");
  const [binded, setBinded] = useState<boolean>(true);
  const [signature, setSignature] = useState<string>("");
  const [bindedTwitter, setBindedTwitter] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    (async () => {
      if (!!telegramDataString) {
        OauthTelegram({
          init_data: telegramDataString,
        }).then(({ response, data }) => {
          if (response?.status === 200 && data?.status === "success") {
            message.success({
              key: "bindTelegram",
              content: "Bind telegram success",
            });
            !!data?.access_token &&
              localStorage.setItem("aime:accessToken", data?.access_token);
            !!data?.access_token && setAccessToken(data?.access_token);
            console.log(data?.access_token);
            !!data?.expire &&
              localStorage.setItem("aime:accessToken:expire", data?.expire);
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
