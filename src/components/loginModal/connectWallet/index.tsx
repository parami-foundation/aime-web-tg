import React, { useEffect } from "react";
import styles from '../style.less';
import { FaAngleRight } from "react-icons/fa";
import { useConnect } from "wagmi";
import { Button, ConfigProvider, notification, theme } from "antd";
import { ReactComponent as MetamaskIcon } from "@/assets/brand/metamask.svg";
import { ReactComponent as CoinbaseIcon } from "@/assets/brand/coinbase.svg";
import { ReactComponent as WalletConnectIcon } from "@/assets/brand/walletconnect.svg";
import { ReactComponent as InjectedIcon } from "@/assets/brand/injected.svg";
import { THEME_CONFIG } from "@/constants/theme";

const ConnectWallet: React.FC = () => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  useEffect(() => {
    if (error) {
      notification.error({
        key: 'connectWallet',
        message: 'Connect wallet failed',
        description: error.message,
      });
    }
  }, [error]);

  return (
    <>
      <div className={styles.loginModalHeader}>
        Log in with wallet
      </div>
      <div className={styles.loginModalContent}>
        {connectors.map((connector) => {
          if (!connector.ready) {
            return null;
          }
          return (
            <ConfigProvider
              theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                  wireframe: false,
                  colorPrimary: THEME_CONFIG.colorWhite,
                  borderRadius: THEME_CONFIG.borderRadius,
                  boxShadow: THEME_CONFIG.boxShadow,
                },
              }}
              key={connector.id}
            >
              <Button
                block
                type="primary"
                size="large"
                className={styles.loginModalContentItem}
                disabled={!connector.ready}
                onClick={() => connect({ connector })}
                key={connector.id}
              >
                <div className={styles.loginModalContentItemLeft}>
                  {connector.id === 'metaMask' && (
                    <MetamaskIcon
                      className={styles.loginModalContentItemIcon}
                    />
                  )}
                  {connector.id === 'coinbaseWallet' && (
                    <CoinbaseIcon
                      className={styles.loginModalContentItemIcon}
                    />
                  )}
                  {connector.id === 'walletConnect' && (
                    <WalletConnectIcon
                      className={styles.loginModalContentItemIcon}
                    />
                  )}
                  {connector.id === 'injected' && (
                    <InjectedIcon
                      className={styles.loginModalContentItemIcon}
                    />
                  )}
                  <div className={styles.loginModalContentItemText}>
                    {connector.name}
                    {!connector.ready && ' (unsupported)'}
                    {isLoading &&
                      connector.id === pendingConnector?.id &&
                      ' (connecting)'}
                  </div>
                </div>
                <div className={styles.loginModalContentItemRight}>
                  <FaAngleRight
                    className={styles.loginModalContentItemRightIcon}
                  />
                </div>
              </Button>
            </ConfigProvider>
          )
        })}
      </div>
    </>
  );
};

export default ConnectWallet;
