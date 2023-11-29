import { InitData, MiniApp, LaunchParams, Utils } from "@tma.js/sdk";
import { DEBUG } from "@/constants/global";
import { TelegramOauthDataOnauthProps } from "@/components/loginModal/telegramOauth";
import { notification } from "antd";
import { useEffect, useState } from "react";
import { useSDKContext } from "@tma.js/sdk-react";
import { StartParam } from "@/services/typing";

export default () => {
  const [telegramData, setTelegramData] = useState<
    InitData | TelegramOauthDataOnauthProps | null
  >(null);
  const [telegramDataString, setTelegramDataString] = useState<string>();
  const [telegramAuthType, setTelegramAuthType] = useState<string>();
  const [telegramMiniAppHeight, setTelegramMiniAppHeight] = useState<number>();
  const [telegramWebApp, setTelegramWebApp] = useState<MiniApp>();
  const [isInMiniApp, setIsInMiniApp] = useState<boolean>(false);
  const [miniAppParams, setMiniAppParams] = useState<LaunchParams>();
  const [miniAppUtils, setMiniAppUtils] = useState<Utils>();

  const { loading, error } = useSDKContext();

  useEffect(() => {
    if (!miniAppParams) return;
    const startParam: StartParam = JSON.parse(
      Buffer.from(
        JSON.parse(JSON.stringify(miniAppParams))?.StartParam + "=",
        "base64"
      ).toString()
    );
    if (!!startParam?.address && !!startParam?.signature) {
      notification.info({
        key: "walletAddress",
        message: "Wallet Address",
        description: startParam?.address,
        duration: 0,
      });
      notification.info({
        key: "walletSignature",
        message: "Wallet Signature",
        description: startParam?.signature,
        duration: 0,
      });
    }
  }, [miniAppParams]);

  useEffect(() => {
    if (!loading && !error) {
      setIsInMiniApp(true);
    } else {
      setIsInMiniApp(false);
    }
  }, [loading, error]);

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
    isInMiniApp,
    setTelegramWebApp,
    telegramWebApp,
    miniAppParams,
    setMiniAppParams,
    miniAppUtils,
    setMiniAppUtils,
  };
};
