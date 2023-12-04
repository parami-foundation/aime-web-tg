import { useInitData, useInitDataRaw, useSDKContext, useViewport, useMiniApp, useLaunchParams, useUtils, useCloudStorage } from "@tma.js/sdk-react";
import { InitData, MiniApp, LaunchParams, Utils, CloudStorage } from "@tma.js/sdk";
import { useModel } from "@umijs/max";
import { PropsWithChildren, useEffect } from "react";
import { TelegramAuth } from "@/services/enum.d";
import { notification } from "antd";

export const TMAInitData = ({ children }: PropsWithChildren) => {
  const { setTelegramData, setTelegramDataString, setTelegramAuthType, setTelegramMiniAppHeight, setTelegramWebApp, setMiniAppParams, setMiniAppUtils, setTelegramCloudStorage } = useModel('useTelegram');

  const { loading, error } = useSDKContext();

  let webApp: MiniApp | null = null;
  let initData: InitData | undefined = undefined;
  let initDataString: string | undefined = undefined;
  let miniAppParams: LaunchParams;
  let miniAppUtils: Utils;
  let cloudstorage: CloudStorage;

  if (!error && !loading) {
    webApp = useMiniApp();
    setTelegramWebApp(webApp);

    const viewport = useViewport()
    viewport.expand();
    setTelegramMiniAppHeight(viewport.height);

    initData = useInitData();
    initDataString = useInitDataRaw();

    miniAppParams = useLaunchParams();
    setMiniAppParams(miniAppParams);

    miniAppUtils = useUtils();
    setMiniAppUtils(miniAppUtils);

    cloudstorage = useCloudStorage();
    setTelegramCloudStorage(cloudstorage);
  };

  useEffect(() => {
    if (!!initData) {
      setTelegramData(initData);
      localStorage.setItem('aime:telegramData', JSON.stringify(initData));
      cloudstorage?.set('aime:telegramData', JSON.stringify(initData));

      setTelegramAuthType(TelegramAuth.APP);
      localStorage.setItem('aime:telegramAuthType', TelegramAuth.APP);
      cloudstorage?.set('aime:telegramAuthType', TelegramAuth.APP);
    }

    if (!!initDataString) {
      setTelegramDataString(decodeURIComponent(initDataString));
      localStorage.setItem('aime:telegramDataString', decodeURIComponent(initDataString));
      cloudstorage?.set('aime:telegramDataString', decodeURIComponent(initDataString));
    }
  }, [initData, initDataString]);

  return (
    <>{children}</>
  );
};