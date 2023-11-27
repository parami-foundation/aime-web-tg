import { useInitData, useSDKContext, useViewport, useMiniApp } from "@tma.js/sdk-react";
import { InitData, MiniApp } from "@tma.js/sdk";
import { useModel } from "@umijs/max";
import { PropsWithChildren, useEffect } from "react";

export const TMAInitData = ({ children }: PropsWithChildren) => {
  const { setTelegramData, setTelegramAuthType, setTelegramMiniAppHeight, setTelegramWebApp } = useModel('useTelegram');

  const { loading, error } = useSDKContext();

  let webApp: MiniApp | null = null;
  let initData: InitData | undefined = undefined;
  if (!error && !loading) {
    webApp = useMiniApp();
    setTelegramWebApp(webApp);

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