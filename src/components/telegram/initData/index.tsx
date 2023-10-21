import { InitData, useInitData, useSDK } from "@tma.js/sdk-react";
import { useModel } from "@umijs/max";
import { useMemo } from "react";

export const TMAInitData = () => {
  const { setTelegramData, setTelegramAuthType } = useModel('tmaInitData');

  const { components, error } = useSDK();

  let initData: InitData | null = null;
  if (!error && !!components) {
    initData = useInitData();
  }

  const initDataJson = useMemo(() => {
    if (!initData) {
      return null;
    }

    return initData;
  }, [initData]);

  setTelegramData(initDataJson);
  setTelegramAuthType('tma');

  return (
    <></>
  );
};