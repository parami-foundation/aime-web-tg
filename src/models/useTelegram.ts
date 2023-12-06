import { TelegramOauthDataOnauthProps } from "@/types";
import {
  InitData,
  MiniApp,
  LaunchParams,
  Utils,
  CloudStorage,
} from "@tma.js/sdk";
import { useEffect, useState } from "react";

export default () => {
  const [telegramOauthModalVisible, setTelegramOauthModalVisible] =
    useState<boolean>(false);
  const [telegramData, setTelegramData] = useState<
    InitData | TelegramOauthDataOnauthProps | null
  >(null);
  const [telegramDataString, setTelegramDataString] = useState<string>();
  const [telegramAuthType, setTelegramAuthType] = useState<string>();
  const [telegramMiniAppHeight, setTelegramMiniAppHeight] = useState<number>();
  const [telegramWebApp, setTelegramWebApp] = useState<MiniApp>();
  const [miniAppParams, setMiniAppParams] = useState<LaunchParams>();
  const [miniAppUtils, setMiniAppUtils] = useState<Utils>();
  const [telegramCloudStorage, setTelegramCloudStorage] =
    useState<CloudStorage>();

  useEffect(() => {
    if (!telegramDataString) {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const initDataString = params.get("tgWebAppData");
      if (!!initDataString) {
        setTelegramDataString(initDataString || "");
        localStorage.setItem("aime:telegramDataString", initDataString);
        telegramCloudStorage?.set("aime:telegramDataString", initDataString);
      }
    }
  }, [telegramDataString, telegramCloudStorage]);

  useEffect(() => {
    (async () => {
      const telegramDataString =
        localStorage.getItem("aime:telegramDataString") ||
        (await telegramCloudStorage?.get("aime:telegramDataString"));
      if (!!telegramDataString) {
        setTelegramDataString(telegramDataString);
      }

      const telegramData =
        JSON.parse(localStorage.getItem("aime:telegramData") || "{}") ||
        (await telegramCloudStorage?.get("aime:telegramData"));
      if (!!telegramData) {
        setTelegramData(telegramData);
      }

      const telegramAuthType =
        localStorage.getItem("aime:telegramAuthType") ||
        (await telegramCloudStorage?.get("aime:telegramAuthType"));
      if (!!telegramAuthType) {
        setTelegramAuthType(telegramAuthType);
      }
    })();
  }, []);

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
    telegramCloudStorage,
    setTelegramCloudStorage,
    telegramOauthModalVisible,
    setTelegramOauthModalVisible,
  };
};
