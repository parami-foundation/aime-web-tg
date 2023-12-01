import { useInitData, useSDKContext, useViewport, useMiniApp, useLaunchParams, useUtils, useCloudStorage } from "@tma.js/sdk-react";
import { InitData, MiniApp, LaunchParams, Utils, CloudStorage } from "@tma.js/sdk";
import { useModel } from "@umijs/max";
import { PropsWithChildren, useEffect } from "react";

export const TMAInitData = ({ children }: PropsWithChildren) => {
  const { setTelegramData, setTelegramAuthType, setTelegramMiniAppHeight, setTelegramWebApp, setMiniAppParams, setMiniAppUtils, setTelegramCloudStorage } = useModel('useTelegram');

  const { loading, error } = useSDKContext();

  let webApp: MiniApp | null = null;
  let initData: InitData | undefined = undefined;
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
      setTelegramAuthType('webapp');
    }
  }, [initData]);

  return (
    <>{children}</>
  );
};