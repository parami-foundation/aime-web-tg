import { useInitData } from "@tma.js/sdk-react";
import { notification } from "antd";
import { useMemo } from "react";

export const InitData = () => {
  const initData = useInitData();

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

  notification.success({
    key: 'initData',
    message: 'Init data success',
    description: initDataJson,
    duration: 0,
  });

  return (
    <></>
  );
};