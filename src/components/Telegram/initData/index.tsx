import { useInitData, useSDK } from "@tma.js/sdk-react";
import { notification } from "antd";
import { useMemo } from "react";

export const InitData = () => {
  const { didInit, components, error } = useSDK();

  let initData: any = null;
  if (!error && !!components) {
    initData = useInitData();
  }

  const initDataJson = useMemo(() => {
    if (!initData) {
      return 'Init data is empty.';
    }
    const { authDate, chat, hash, canSendAfter, queryId, receiver, user, startParam } = initData;

    return JSON.stringify({
      authDate,
      chat,
      hash,
      canSendAfter,
      queryId,
      receiver,
      user,
      startParam,
    }, null, ' ');
  }, [initData]);

  notification.info({
    key: 'initData',
    message: 'Telegram InitData',
    description: initDataJson,
    duration: 0,
  });

  return (
    <></>
  );
};