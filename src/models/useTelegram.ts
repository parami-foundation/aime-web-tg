import { TELEGRAM_AUTH_EXPIRE } from "@/constants/global";
import { TelegramOauthDataOnauthProps } from "@/types";
import {
  InitData,
  MiniApp,
  LaunchParams,
  Utils,
  CloudStorage,
  BackButton,
  MainButton,
  ThemeParams,
} from "@tma.js/sdk";
import queryString from "query-string";
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
  const [miniAppBackButton, setMiniAppBackButton] = useState<BackButton>();
  const [miniAppMainButton, setMiniAppMainButton] = useState<MainButton>();
  const [miniAppThemeParams, setMiniAppThemeParams] = useState<ThemeParams>();

  useEffect(() => {
    (async () => {
      const telegramAuthType =
        localStorage.getItem("aime:telegramAuthType") ||
        (await telegramCloudStorage?.get("aime:telegramAuthType"));
      const telegramDataString =
        localStorage.getItem("aime:telegramDataString") ||
        (await telegramCloudStorage?.get("aime:telegramDataString"));
      const telegramData =
        JSON.parse(localStorage.getItem("aime:telegramData") || "{}") ||
        (await telegramCloudStorage?.get("aime:telegramData"));

      if (!!telegramDataString) {
        const raw = queryString.parse(telegramDataString)
        if (!!raw && !!raw?.auth_date) {
          if (new Date().getTime() < parseInt(raw?.auth_date as string) * 1000 + TELEGRAM_AUTH_EXPIRE) {
            setTelegramDataString(telegramDataString);
            !!telegramAuthType && setTelegramAuthType(telegramAuthType);
            !!telegramData && setTelegramData(telegramData);
          } else {
            cleanTelegramData();
            !!telegramWebApp && window.location.reload();
          }
        }
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
    miniAppBackButton,
    setMiniAppBackButton,
    miniAppMainButton,
    setMiniAppMainButton,
    miniAppThemeParams,
    setMiniAppThemeParams,
  };
};
