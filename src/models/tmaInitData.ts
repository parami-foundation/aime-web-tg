import { TelegramOauthDataOnauthProps } from "@/pages/auth/components/telegramOauth";
import { InitData, useInitData, useSDK } from "@tma.js/sdk-react";
import { notification } from "antd";
import { useEffect, useState } from "react";

export default () => {
  const [telegramData, setTelegramData] = useState<
    InitData | TelegramOauthDataOnauthProps | null
  >(null);

  useEffect(() => {
    if (!!telegramData) {
      notification.info({
        key: "initData",
        message: "Telegram InitData",
        description: telegramData ? JSON.stringify(telegramData) : "empty",
        duration: 0,
      });
    }
  }, [telegramData]);

  return {
    telegramData,
    setTelegramData,
  };
};
