import LoginModal from '@/components/loginModal';
import TelegramOauth from '@/components/telegram/oauth';
import { useModel } from '@umijs/max';
import { useEffect, type PropsWithChildren } from 'react';

export const AccessLayout = ({ children }: PropsWithChildren) => {
  const { accessToken } = useModel('useAccess');
  const { walletModalVisible, walletBinded, setWalletModalVisible } = useModel('useWallet');
  const { telegramOauthModalVisible, setTelegramOauthModalVisible } = useModel('useTelegram');

  useEffect(() => {
    if (!accessToken) {
      setTelegramOauthModalVisible(true);
    } else {
      setTelegramOauthModalVisible(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (walletBinded) {
      setWalletModalVisible(false);
    }
  }, [walletBinded]);

  return (
    <>
      {children}
      <TelegramOauth
        visible={telegramOauthModalVisible}
        setVisible={setTelegramOauthModalVisible}
      />
      <LoginModal
        visible={walletModalVisible}
        setVisible={setWalletModalVisible}
        closeable
      />
    </>
  );
}
