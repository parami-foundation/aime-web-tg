import React, { useEffect, useMemo } from 'react';
import styles from './style.less';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as LogoTitle } from '@/assets/auth/aime_logo_text.svg';
import { ReactComponent as LogoWebUrl } from '@/assets/auth/aime_web_url.svg';
import { Button, notification } from 'antd';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount, useNetwork, useSignMessage, useSwitchNetwork } from 'wagmi';
import { BIND_WALLET_MESSAGE } from '@/constants/global';
import TelegramOauth, { TelegramOauthDataOnauthProps } from './components/telegramOauth';
import { useSDK } from '@tma.js/sdk-react';

export interface AuthProps { };

const Auth: React.FC<AuthProps> = () => {
  const { open } = useWeb3Modal();
  const { data: signature, error: signMsgError, isLoading: signMsgLoading, signMessage } = useSignMessage();
  const { error: tmaError } = useSDK();

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
            {!isConnected && tmaError && (
              <TelegramOauth
                dataOnauth={(response: TelegramOauthDataOnauthProps) => {
                  const initDataJson = useMemo(() => {
                    if (!response) {
                      return 'Init data is empty.';
                    }
                    const { id, first_name, last_name, username, photo_url, auth_date, hash } = response;

                    return JSON.stringify({
                      id,
                      first_name,
                      last_name,
                      username,
                      photo_url,
                      auth_date,
                      hash,
                    }, null, ' ');
                  }, [response]);

                  notification.info({
                    key: 'initData',
                    message: 'Telegram InitData',
                    description: initDataJson,
                    duration: 0,
                  });
                }}
              />
            )}
            {!isConnected && !tmaError && (
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
            {isConnected && currentChain?.id !== chains[0]?.id && !tmaError && (
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
            {isConnected && currentChain?.id === chains[0]?.id && !tmaError && (
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
