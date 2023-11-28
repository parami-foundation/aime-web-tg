import LoginModal from '@/components/loginModal';
import TelegramOauth from '@/components/telegram/oauth';
import { useModel } from '@umijs/max';
import { message } from 'antd';
import { useEffect, type PropsWithChildren } from 'react';
import { useAccount } from 'wagmi';

export const AccessLayout = ({ children }: PropsWithChildren) => {
  const { accessToken, telegramOauthModalVisible, setTelegramOauthModalVisible, walletModalVisible, setWalletModalVisible, setAddress } = useModel('useAccess');

  const { isConnected, address } = useAccount({
    onConnect: () => {
      message.success({
        key: 'connectWallet',
        content: 'Connect wallet success'
      });
      setAddress(address);
    },
    onDisconnect: () => {
      message.success({
        key: 'disconnectWallet',
        content: 'Disconnect wallet success'
      });
      setAddress(undefined);
    }
  });

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
