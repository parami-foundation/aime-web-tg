import { API_CONFIG } from "@/constants/global";
import { GetLoginMethod, GetProfile, OauthTelegram } from "@/services/api";
import { useModel } from "@umijs/max";
import { message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Resp } from "@/types";
import { ApiError } from "@/types/enum";

export default () => {
  const { telegramDataString, telegramAuthType, telegramCloudStorage, cleanTelegramData } =
    useModel("useTelegram");
  const { setTwitterLoginMethod } = useModel("useTwitter");
  const [loginMethod, setLoginMethod] = useState<Resp.LoginMethod[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [accessTokenExpire, setAccessTokenExpire] = useState<number | null>(null);
  const [profile, setProfile] = useState<Resp.Profile>({});
  const [refer, setRefer] = useState<string>();

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
      if (data?.error === ApiError.InvalidToken) {
        await cleanAccessToken();
        await cleanTelegramData();
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
    ; (async () => {
      if (!accessToken) {
        return;
      }
      const { response, data } = await GetLoginMethod(accessToken);
      if (response?.status === 200) {
        setLoginMethod(data);
        console.log("loginMethod", data)

        const twitter = data.find((item) => item.name === "twitter");
        if (!!twitter) {
          setTwitterLoginMethod(twitter);
        }
      }
    })()
  }, [accessToken]);

  useEffect(() => {
    if (!!telegramDataString && !!telegramAuthType && !accessToken && !accessTokenExpire) {
      oauthTelegram();
    }
  }, [telegramDataString, telegramAuthType, accessToken, accessTokenExpire]);

  useEffect(() => {
    (async () => {
      const accessToken =
        localStorage.getItem("aime:accessToken") ||
        (await telegramCloudStorage?.get("aime:accessToken"));
      const accessTokenExpire =
        localStorage.getItem("aime:accessToken:expire") ||
        (await telegramCloudStorage?.get("aime:accessToken:expire"));

      const now = new Date().getTime();

      if (!!accessTokenExpire && parseInt(accessTokenExpire) < now) {
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
    loginMethod,
    accessToken,
    accessTokenExpire,
    profile,
    refer,
    setRefer,
    setAccessToken,
    setAccessTokenExpire,
    oauthTelegram,
  };
};
