import { InitData, useInitData, useSDK } from "@tma.js/sdk-react";
import { useModel } from "@umijs/max";
import { useEffect, useMemo } from "react";

export const TMAInitData = () => {
  const { setTelegramData, setTelegramAuthType } = useModel('useTelegram');

  const { components, error } = useSDK();

  let initData: InitData | null = null;
  if (!error && !!components) {
    initData = useInitData();
  }

  useEffect(() => {
    if (!initData) {
      return;
    }

    setTelegramData(initData);
    setTelegramAuthType('webapp');

  }, [initData]);

  return (
    <></>
  );
};