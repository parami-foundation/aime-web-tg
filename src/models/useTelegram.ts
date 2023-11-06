import { DEBUG } from "@/constants/global";
import { TelegramOauthDataOnauthProps } from "@/components/loginModal/telegramOauth";
import { InitData, WebApp } from "@tma.js/sdk-react";
import { notification } from "antd";
import { useEffect, useState } from "react";

export default () => {
  const [telegramData, setTelegramData] = useState<
    InitData | TelegramOauthDataOnauthProps | null
  >(null);
  const [telegramDataString, setTelegramDataString] = useState<string>();
  const [telegramAuthType, setTelegramAuthType] = useState<string>();
  const [telegramMiniAppHeight, setTelegramMiniAppHeight] = useState<number>();
  const [telegramWebApp, setTelegramWebApp] = useState<WebApp>();

  useEffect(() => {
    if (!!telegramData) {
      if (!telegramDataString) {
        const params = new URLSearchParams(window.location.hash.slice(1));
        const initDataString = params.get("tgWebAppData");
        setTelegramDataString(initDataString || "");
      }

      if (DEBUG) {
        notification.info({
          key: "initData",
          message: "Telegram InitData",
          description: telegramDataString ? telegramDataString : "No data",
          duration: 0,
        });
      }
    }
  }, [telegramData, telegramDataString]);

  return {
    telegramData,
    setTelegramData,
    telegramDataString,
    setTelegramDataString,
    telegramAuthType,
    setTelegramAuthType,
    telegramMiniAppHeight,
    setTelegramMiniAppHeight,
    telegramWebApp,
    setTelegramWebApp,
  };
};
