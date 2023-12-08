import { API_CONFIG } from "@/constants/global";
import { GetProfile, OauthTelegram } from "@/services/api";
import { useModel } from "@umijs/max";
import { message } from "antd";
import { useCallback, useEffect, useState } from "react";
import type { Resp } from "@/types";

export default () => {
  const { telegramDataString, telegramAuthType, telegramCloudStorage, setTelegramData, setTelegramDataString, setTelegramAuthType, cleanTelegramData } =
    useModel("useTelegram");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [accessTokenExpire, setAccessTokenExpire] = useState<number | null>(null);
  const [profile, setProfile] = useState<Resp.Profile>({});

  const [twitterBinded, setTwitterBinded] = useState<boolean>(true);

  const oauthTelegram = async () => {
    const { response, data } = await OauthTelegram({
      grant_type: API_CONFIG.grant_type,
      subject_token: telegramDataString,
      subject_issuer: telegramAuthType,
    });

    if (response?.status === 200) {
      message.success({
        key: "loginSuccess",
        content: "Login success",
      });

      // Store access token
      !!data?.access_token &&
        localStorage.setItem("aime:accessToken", data?.access_token);
      !!data?.access_token &&
        telegramCloudStorage?.set("aime:accessToken", data?.access_token);
      !!data?.access_token && setAccessToken(data?.access_token);

      // Store access token expire
      const now = new Date().getTime();
      !!data?.expires_in &&
        localStorage.setItem(
          "aime:accessToken:expire",
          (now + data?.expires_in * 1000).toString()
        );
      !!data?.expires_in &&
        telegramCloudStorage?.set(
          "aime:accessToken:expire",
          (now + data?.expires_in * 1000).toString()
        );
      !!data?.expires_in && setAccessTokenExpire(now + data?.expires_in * 1000);
    } else {
      if (data?.error === "invalid_token") {
        localStorage.removeItem("aime:telegramAuthType");
        telegramCloudStorage?.delete("aime:telegramAuthType");
        localStorage.removeItem("aime:telegramDataString");
        telegramCloudStorage?.delete("aime:telegramDataString");
        localStorage.removeItem("aime:telegramData");
        telegramCloudStorage?.delete("aime:telegramData");
        setTelegramAuthType(undefined);
        setTelegramDataString(undefined);
        setTelegramData({});
      }
      message.error({
        key: "loginFailed",
        content: "Login failed",
      });
    }
  };

  const cleanAccessToken = async () => {
    localStorage.removeItem("aime:accessToken");
    localStorage.removeItem("aime:accessToken:expire");
    telegramCloudStorage?.delete("aime:accessToken");
    telegramCloudStorage?.delete("aime:accessToken:expire");
    setAccessToken(null);
    setAccessTokenExpire(null);
  };

  useEffect(() => {
    if (!!telegramDataString && !!telegramAuthType && !accessToken && !accessTokenExpire) {
      oauthTelegram();
    }
  }, [telegramDataString, accessToken]);

  useEffect(() => {
    (async () => {
      const accessToken =
        localStorage.getItem("aime:accessToken") ||
        (await telegramCloudStorage?.get("aime:accessToken"));
      const accessTokenExpire =
        localStorage.getItem("aime:accessToken:expire") ||
        (await telegramCloudStorage?.get("aime:accessToken:expire"));

      const now = new Date().getTime();

      if (!accessTokenExpire || parseInt(accessTokenExpire) < now) {
        await cleanAccessToken();
        await cleanTelegramData();
      }
      if (!!accessToken) {
        setAccessToken(accessToken);
      }
      if (!!accessTokenExpire) {
        setAccessTokenExpire(parseInt(accessTokenExpire));
      }
    })();
  }, [accessToken, accessTokenExpire]);

  useEffect(() => {
    ; (async () => {
      if (!accessToken) {
        return;
      }
      const { response, data } = await GetProfile(accessToken);
      if (response?.status === 200) {
        setProfile(data);
      }
    })()
  }, [accessToken]);

  return {
    accessToken,
    accessTokenExpire,
    twitterBinded,
    profile,
    setAccessToken,
    setAccessTokenExpire,
    setTwitterBinded,
    oauthTelegram,
  };
};
