import { InitData, WebApp, useClosingBehaviour, useInitData, useSDK, useViewport, useWebApp } from "@tma.js/sdk-react";
import { useModel } from "@umijs/max";
import { PropsWithChildren, useEffect } from "react";

export const TMAInitData = ({ children }: PropsWithChildren) => {
  const { setTelegramData, setTelegramAuthType, setTelegramMiniAppHeight, setTelegramWebApp } = useModel('useTelegram');

  const { components, error } = useSDK();

  let webApp: WebApp | null = null;
  let initData: InitData | null = null;
  if (!error && !!components) {
    webApp = useWebApp();
    setTelegramWebApp(webApp);

    const closingConfirmation = useClosingBehaviour()
    closingConfirmation.enableConfirmation();

    const viewport = useViewport()
    viewport.expand();
    setTelegramMiniAppHeight(viewport.height);

    initData = useInitData();
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