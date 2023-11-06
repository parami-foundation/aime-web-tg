import React, { useEffect } from 'react';
import styles from './style.less';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as LogoTitle } from '@/assets/auth/aime_logo_text.svg';
import { ReactComponent as LogoWebUrl } from '@/assets/auth/aime_web_url.svg';
import { Button } from 'antd';
import { useModel, history } from '@umijs/max';
import LoginModal from '@/components/loginModal';

const Auth: React.FC = () => {
  const { accessToken, address } = useModel('useAccess');
  const [walletModalOpen, setWalletModalOpen] = React.useState<boolean>(false);

  useEffect(() => {
    if (!accessToken || !address) {
      setWalletModalOpen(true);
    } else {
      setWalletModalOpen(false);
      // TODO: DEMO
      history.push('/chat/demo');
    }
  }, [accessToken, address]);

  return (
    <>
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
          <Button
            block
            type="primary"
            size="large"
            className={styles.button}
            onClick={() => {
              setWalletModalOpen(true);
            }}
          >
            Connect Wallet
          </Button>
        </div>
      </div>
      <LoginModal
        visible={walletModalOpen}
        setVisible={setWalletModalOpen}
      />
    </>
  );
};

export default Auth;
