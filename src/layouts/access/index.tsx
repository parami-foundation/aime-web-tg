import TelegramOauth from '@/components/telegram/oauth';
import { useModel } from '@umijs/max';
import { useEffect, type PropsWithChildren } from 'react';

export const AccessLayout = ({ children }: PropsWithChildren) => {
  const { accessToken, telegramOauthModalVisible, setTelegramOauthModalVisible } = useModel('useAccess');

  useEffect(() => {
    if (!accessToken) {
      setTelegramOauthModalVisible(true);
    } else {
      setTelegramOauthModalVisible(false);
    }
  }, [accessToken]);

  return (
    <>
      {children}
      <TelegramOauth
        visible={telegramOauthModalVisible}
        setVisible={setTelegramOauthModalVisible}
        closeable={true}
      />
    </>
  );
}
