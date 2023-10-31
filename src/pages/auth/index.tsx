import React, { useEffect } from 'react';
import styles from './style.less';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as LogoTitle } from '@/assets/auth/aime_logo_text.svg';
import { ReactComponent as LogoWebUrl } from '@/assets/auth/aime_web_url.svg';
import { Button, message } from 'antd';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount, useNetwork, useSignMessage, useSwitchNetwork } from 'wagmi';
import TelegramOauth, { TelegramOauthDataOnauthProps } from './components/telegramOauth';
import { useSDK } from '@tma.js/sdk-react';
import { useModel } from '@umijs/max';
import SwitchNetwork from './components/switchNetwork';
import SignMessage from './components/signMessage';
import { AccessLayout } from '@/layouts/access';
import { OauthTelegram } from '@/service/api';

export interface AuthProps { };

const Auth: React.FC<AuthProps> = () => {
  const { telegramData, telegramDataString, setTelegramData, setTelegramDataString, setTelegramAuthType } = useModel('tmaInitData');
  const { setBinded, setSignature } = useModel('checkAccess');

  const { open } = useWeb3Modal();
  const { data: signature, error: signMsgError, isLoading: signMsgLoading, signMessage } = useSignMessage();
  const { error: tmaError } = useSDK();

  const { isConnected } = useAccount({
    onConnect: () => {
      message.success({
        key: 'connectWallet',
        content: 'Connect wallet success'
      })
    },
    onDisconnect: () => {
      message.success({
        key: 'disconnectWallet',
        content: 'Disconnect wallet success'
      })
    }
  });
  const { chain: currentChain } = useNetwork();
  const { chains } = useSwitchNetwork();

  useEffect(() => {
    if (!!signature && !signMsgLoading && !signMsgError) {
      setSignature(signature);
      setBinded(true);

      // TODO: bind wallet
      message.success({
        key: 'bindWallet',
        content: 'Bind wallet success'
      })
    }
  }, [signature, signMsgLoading, signMsgError]);

  useEffect(() => {
    (async () => {
      if (!!telegramDataString) {
        OauthTelegram({
          init_data: telegramDataString,
        }).then((res) => {
          if (res?.response?.code === 200 && res?.data?.status === "success") {
            message.success({
              key: 'bindTelegram',
              content: 'Bind telegram success'
            })
            !!res?.data?.access_token && localStorage.setItem('aime:accessToken', res?.data?.access_token);
            !!res?.data?.expire && localStorage.setItem('aime:accessToken:expire', res?.data?.expire);
          }
        });
      }
    })();
  }, [telegramDataString]);

  return (
    <AccessLayout>
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
              {!telegramData && tmaError && (
                <TelegramOauth
                  dataOnauth={(response: TelegramOauthDataOnauthProps) => {
                    setTelegramData(response);
                    setTelegramAuthType('oauth');
                    let initDataString = "";
                    for (let key in response) {
                      if (initDataString != "") {
                        initDataString += "&";
                      }
                      initDataString +=
                        key + "=" + encodeURIComponent((response as any)[key]);
                    }
                    setTelegramDataString(initDataString);
                  }}
                />
              )}
              {!!telegramData && !isConnected && (
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
              {!!telegramData && isConnected && currentChain?.id !== chains[0]?.id && (
                <SwitchNetwork />
              )}
              {!!telegramData && isConnected && currentChain?.id === chains[0]?.id && (
                <SignMessage
                  error={signMsgError}
                  isLoading={signMsgLoading}
                  signMessage={signMessage}
                />
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
      </div>
    </AccessLayout>
  );
};

export default Auth;
