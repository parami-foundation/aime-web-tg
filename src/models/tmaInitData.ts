import { TelegramOauthDataOnauthProps } from "@/pages/auth/components/telegramOauth";
import { InitData } from "@tma.js/sdk-react";
import { notification } from "antd";
import { useEffect, useState } from "react";

export default () => {
  const [telegramData, setTelegramData] = useState<
    InitData | TelegramOauthDataOnauthProps | null
  >(null);
  const [telegramDataString, setTelegramDataString] = useState<string>();
  const [telegramAuthType, setTelegramAuthType] = useState<string>();

  useEffect(() => {
    if (!!telegramData) {
      if (!telegramDataString) {
        const params = new URLSearchParams(window.location.hash.slice(1));
        const initDataString = params.get("tgWebAppData");
        setTelegramDataString(initDataString || "");
      }

      notification.info({
        key: "initData",
        message: "Telegram InitData",
        description: telegramDataString ? telegramDataString : "No data",
        duration: 0,
      });
    }
  }, [telegramData, telegramDataString]);

  return {
    telegramData,
    setTelegramData,
    telegramDataString,
    setTelegramDataString,
    telegramAuthType,
    setTelegramAuthType,
  };
};
