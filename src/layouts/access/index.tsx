import LoginModal from '@/components/loginModal';
import TelegramOauth from '@/components/telegram/oauth';
import { useModel } from '@umijs/max';
import { useEffect, type PropsWithChildren } from 'react';
import { useAccount } from 'wagmi';

export const AccessLayout = ({ children }: PropsWithChildren) => {
  const { accessToken } = useModel('useAccess');
  const { walletModalVisible, setWalletModalVisible } = useModel('useWallet');
  const { telegramOauthModalVisible, setTelegramOauthModalVisible } = useModel('useTelegram');

  const { isConnected, address } = useAccount();

  useEffect(() => {
    if (!accessToken) {
      setTelegramOauthModalVisible(true);
    } else {
      setTelegramOauthModalVisible(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isConnected && !!address) {
      setWalletModalVisible(false);
    }
  }, [address, isConnected]);

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
