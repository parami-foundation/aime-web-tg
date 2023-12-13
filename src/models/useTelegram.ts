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

  const cleanTelegramData = async () => {
    localStorage.removeItem("aime:telegramAuthType");
    telegramCloudStorage?.delete("aime:telegramAuthType");
    localStorage.removeItem("aime:telegramDataString");
    telegramCloudStorage?.delete("aime:telegramDataString");
    localStorage.removeItem("aime:telegramData");
    telegramCloudStorage?.delete("aime:telegramData");
    setTelegramAuthType(undefined);
    setTelegramDataString(undefined);
    setTelegramData({});
  };

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
    cleanTelegramData,
  };
};
