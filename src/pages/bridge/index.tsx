import React, { useEffect } from "react";
import styles from "./style.less";
import { useModel } from "@umijs/max";
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as LogoTitle } from '@/assets/auth/aime_logo_text.svg';
import SwitchNetwork from "./switchNetwork";
import ConnectWallet from "./connectWallet";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { Button, Result, message } from "antd";
import queryString from 'query-string';
import BuyModal from "../chat/detail/buyModal";

const Bridge: React.FC = () => {
  const { telegramDataString } = useModel('useTelegram');
  const { setAddress } = useModel('useAccess');

  const [buyModalVisible, setBuyModalVisible] = React.useState<boolean>(false);

  const { chain: currentChain } = useNetwork();
  const { chains } = useSwitchNetwork();
  const { address, isConnected } = useAccount({
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

  const search = queryString.parse(window.location.search);

  useEffect(() => {
    if (!!telegramDataString && isConnected && currentChain?.id === chains[0]?.id) {
      setBuyModalVisible(true);
    }
  }, [search, !!telegramDataString, isConnected, currentChain?.id !== chains[0]?.id]);

  return (
    <div className={styles.bridgeContainer}>
      {!!telegramDataString && (
        <>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <Logo />
            </div>
            <div className={styles.title}>
              <LogoTitle />
            </div>
          </div>
          <div className={styles.contentContainer}>
            {!!telegramDataString && !isConnected && (
              <ConnectWallet />
            )}
            {!!telegramDataString && isConnected && currentChain?.id !== chains[0]?.id && (
              <SwitchNetwork />
            )}
          </div>
        </>
      )}
      {!telegramDataString && (
        <Result
          icon={
            <div className={styles.logoContainer}>
              <div className={styles.logo}>
                <Logo />
              </div>
              <div className={styles.title}>
                <LogoTitle />
              </div>
            </div>
          }
          status="error"
          title="SDK init error"
          subTitle="SDK init function is not yet called."
          extra={[
            <Button
              type="primary"
              key="retry"
              size='large'
              onClick={() => {
                window.location.reload();
              }}
            >
              Retry
            </Button>,
          ]}
        />
      )}
      <BuyModal
        visible={buyModalVisible}
        setVisible={setBuyModalVisible}
      />
    </div>
  )
};

export default Bridge;
