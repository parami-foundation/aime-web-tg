import { useInitData, useInitDataRaw, useSDKContext, useViewport, useMiniApp, useLaunchParams, useUtils, useCloudStorage, useBackButton, useMainButton, useThemeParams } from "@tma.js/sdk-react";
import { InitData, MiniApp, LaunchParams, Utils, CloudStorage, BackButton, MainButton, ThemeParams } from "@tma.js/sdk";
import { useModel } from "@umijs/max";
import { PropsWithChildren, useEffect } from "react";
import { TelegramAuth } from "@/types/enum";
import { DEBUG } from "@/constants/global";
import { THEME_CONFIG } from "@/constants/theme";

export const TMAInitData = ({ children }: PropsWithChildren) => {
  const { setTelegramData, setTelegramDataString, setTelegramAuthType, setTelegramMiniAppHeight, setTelegramWebApp, setMiniAppParams, setMiniAppUtils, setTelegramCloudStorage, setMiniAppBackButton, setMiniAppMainButton, setMiniAppThemeParams } = useModel('useTelegram');

  const { loading, error } = useSDKContext();

  let webApp: MiniApp | null = null;
  let initData: InitData | undefined = undefined;
  let initDataString: string | undefined = undefined;
  let miniAppParams: LaunchParams;
  let miniAppUtils: Utils;
  let cloudstorage: CloudStorage;
  let backButton: BackButton;
  let mainButton: MainButton;
  let themeParams: ThemeParams;

  if (!error && !loading) {
    webApp = useMiniApp();
    setTelegramWebApp(webApp);
    DEBUG && console.log('webApp', webApp);
    webApp?.setHeaderColor("#ffffff");
    webApp?.setBackgroundColor("#ffffff");

    const viewport = useViewport()
    viewport.expand();
    setTelegramMiniAppHeight(viewport.height);
    DEBUG && console.log('viewport', viewport);

    initData = useInitData();
    DEBUG && console.log('initData', initData);
    initDataString = useInitDataRaw();
    DEBUG && console.log('initDataString', initDataString);

    miniAppParams = useLaunchParams();
    setMiniAppParams(miniAppParams);
    DEBUG && console.log('miniAppParams', miniAppParams);

    miniAppUtils = useUtils();
    setMiniAppUtils(miniAppUtils);
    DEBUG && console.log('miniAppUtils', miniAppUtils);

    cloudstorage = useCloudStorage();
    setTelegramCloudStorage(cloudstorage);
    DEBUG && console.log('cloudstorage', cloudstorage);

    backButton = useBackButton();
    setMiniAppBackButton(backButton);
    DEBUG && console.log('backButton', backButton);

    mainButton = useMainButton();
    setMiniAppMainButton(mainButton);
    DEBUG && console.log('mainButton', mainButton);

    themeParams = useThemeParams();
    setMiniAppThemeParams(themeParams);
    DEBUG && console.log('themeParams', themeParams);
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
  }, [initData, initDataString, error, loading]);

  return (
    <>{children}</>
  );
};