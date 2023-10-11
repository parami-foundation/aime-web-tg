import React, { useEffect, useMemo } from 'react';
import styles from './style.less';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as LogoTitle } from '@/assets/auth/aime_logo_text.svg';
import { ReactComponent as LogoWebUrl } from '@/assets/auth/aime_web_url.svg';
import { Button, notification } from 'antd';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useSignMessage } from 'wagmi';
import { BIND_WALLET_MESSAGE } from '@/constants/global';

export interface AuthProps { };

const Auth: React.FC<AuthProps> = () => {
  const { open } = useWeb3Modal();
  const { data: signature, error: signMsgError, isLoading: signMsgLoading, signMessage } = useSignMessage();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && !signature) {
      signMessage({
        message: BIND_WALLET_MESSAGE
      })
    }
  }, [isConnected, signature]);

  useEffect(() => {
    if (!!signature) {
      console.log('got sig from user', signature);
      notification.success({
        message: 'Bind wallet success'
      })
    }
  }, [signature]);

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
          <Button
            block
            type="primary"
            size="large"
            className={styles.button}
            onClick={() => {
              if (!isConnected) {
                open();
              } else {
                signMessage({
                  message: BIND_WALLET_MESSAGE
                })
              }
            }}
          >
            Connect Wallet
          </Button>
        ) : (
          <Button
            block
            type="primary"
            size="large"
            className={styles.button}
          >
            Bind Success
          </Button>
        )}
      </div>
    </div>
  );
};

export default Auth;
