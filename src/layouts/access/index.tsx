import LoginModal from '@/components/loginModal';
import TelegramOauth from '@/components/telegram/oauth';
import TwitterOauth from '@/components/twitter/oauth';
import { useModel } from '@umijs/max';
import { useEffect, type PropsWithChildren } from 'react';

export const AccessLayout = ({ children }: PropsWithChildren) => {
  const { accessToken } = useModel('useAccess');
  const { walletModalVisible, setWalletModalVisible } = useModel('useWallet');
  const { telegramOauthModalVisible, setTelegramOauthModalVisible } = useModel('useTelegram');
  const { twitterOauthModalVisible, setTwitterOauthModalVisible } = useModel('useTwitter');

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
      <LoginModal
        visible={walletModalVisible}
        setVisible={setWalletModalVisible}
      />
      <TelegramOauth
        visible={telegramOauthModalVisible}
        setVisible={setTelegramOauthModalVisible}
      />
      <TwitterOauth
        visible={twitterOauthModalVisible}
        setVisible={setTwitterOauthModalVisible}
      />
    </>
  );
}
