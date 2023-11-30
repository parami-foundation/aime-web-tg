import { InitData, MiniApp, LaunchParams, Utils } from "@tma.js/sdk";
import { DEBUG } from "@/constants/global";
import { TelegramOauthDataOnauthProps } from "@/components/loginModal/telegramOauth";
import { notification } from "antd";
import { useEffect, useState } from "react";

export default () => {
  const [telegramData, setTelegramData] = useState<
    InitData | TelegramOauthDataOnauthProps | null
  >(null);
  const [telegramDataString, setTelegramDataString] = useState<string>();
  const [telegramAuthType, setTelegramAuthType] = useState<string>();
  const [telegramMiniAppHeight, setTelegramMiniAppHeight] = useState<number>();
  const [telegramWebApp, setTelegramWebApp] = useState<MiniApp>();
  const [miniAppParams, setMiniAppParams] = useState<LaunchParams>();
  const [miniAppUtils, setMiniAppUtils] = useState<Utils>();

  useEffect(() => {
    if (!miniAppParams) return;
    const startParam = JSON.parse(JSON.stringify(miniAppParams))?.startParam;

    if (!!startParam) {
      notification.info({
        key: "telegramParams",
        message: "Telegram Params",
        description: startParam,
        duration: 0,
      });
    }
  }, [miniAppParams]);

  useEffect(() => {
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
    setTelegramWebApp,
    telegramWebApp,
    miniAppParams,
    setMiniAppParams,
    miniAppUtils,
    setMiniAppUtils,
  };
};
