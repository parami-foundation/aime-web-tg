import React, { useEffect } from 'react';
import styles from './style.less';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as LogoTitle } from '@/assets/auth/aime_logo_text.svg';
import { ReactComponent as LogoWebUrl } from '@/assets/auth/aime_web_url.svg';
import { Button, notification } from 'antd';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useNetwork, useSignMessage, useSwitchNetwork } from 'wagmi';
import { BIND_WALLET_MESSAGE } from '@/constants/global';

export interface AuthProps { };

const Auth: React.FC<AuthProps> = () => {
  const { open } = useWeb3Modal();
  const { data: signature, error: signMsgError, isLoading: signMsgLoading, signMessage } = useSignMessage();

  const { isConnected } = useAccount({
    onConnect: () => {
      notification.success({
        key: 'connectWallet',
        message: 'Connect wallet success'
      })
    },
    onDisconnect: () => {
      notification.success({
        key: 'disconnectWallet',
        message: 'Disconnect wallet success'
      })
    }
  });
  const { chain: currentChain } = useNetwork();
  const { chains, switchNetworkAsync } = useSwitchNetwork();

  useEffect(() => {
    if (!!signature && !signMsgLoading && !signMsgError) {
      console.log('got sig from user', signature);
      notification.success({
        key: 'bindWallet',
        message: 'Bind wallet success'
      })
    }
  }, [signature, signMsgLoading, signMsgError]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <Logo />
        </div>
        <div className={styles.title}>
          <LogoTitle />
        </div>
        <div className={styles.webUrl}>
          <LogoWebUrl />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        {!signature ? (
          <>
            {!isConnected && (
              <Button
                block
                type="primary"
                size="large"
                className={styles.button}
                onClick={() => {
                  open();
                }}
              >
                Connect Wallet
              </Button>
            )}
            {isConnected && currentChain?.id !== chains[0]?.id && (
              <Button
                block
                type="primary"
                size="large"
                className={styles.button}
                onClick={() => {
                  switchNetworkAsync?.(chains[0]?.id);
                }}
              >
                Switch Network
              </Button>
            )}
            {isConnected && currentChain?.id === chains[0]?.id && (
              <Button
                block
                type="primary"
                size="large"
                className={styles.button}
                onClick={() => {
                  signMessage({
                    message: BIND_WALLET_MESSAGE
                  })
                }}
              >
                Sign Message
              </Button>
            )}
          </>
        ) : (
          <Button
            block
            type="primary"
            size="large"
            className={styles.button}
          >
            Bind Wallet Success
          </Button>
        )}
      </div>
    </div >
  );
};

export default Auth;
