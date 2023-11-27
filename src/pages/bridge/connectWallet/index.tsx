import React, { useEffect } from "react";
import styles from '../style.less';
import { FaAngleRight } from "react-icons/fa";
import { useConnect } from "wagmi";
import { Button, ConfigProvider, Tag, notification, theme } from "antd";
import { ReactComponent as MetamaskIcon } from "@/assets/brand/metamask.svg";
import { ReactComponent as CoinbaseIcon } from "@/assets/brand/coinbase.svg";
import { ReactComponent as WalletConnectIcon } from "@/assets/brand/walletconnect.svg";
import { ReactComponent as InjectedIcon } from "@/assets/brand/injected.svg";
import { THEME_CONFIG } from "@/constants/theme";

const ConnectWallet: React.FC = () => {
  const { connect, connectors, error } = useConnect();

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
      <div className={styles.bridgeHeader}>
        Log in with wallet
      </div>
      <div className={styles.bridgeContent}>
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
            >
              <Button
                block
                type="primary"
                size="large"
                className={styles.bridgeContentItem}
                onClick={() => {
                  connect({ connector });
                }}
              >
                <div className={styles.bridgeContentItemLeft}>
                  {connector.id === 'metaMask' && (
                    <MetamaskIcon
                      className={styles.bridgeContentItemIcon}
                    />
                  )}
                  {connector.id === 'coinbaseWallet' && (
                    <CoinbaseIcon
                      className={styles.bridgeContentItemIcon}
                    />
                  )}
                  {connector.id === 'walletConnect' && (
                    <WalletConnectIcon
                      className={styles.bridgeContentItemIcon}
                    />
                  )}
                  {connector.id === 'eip6963' && (
                    <InjectedIcon
                      className={styles.bridgeContentItemIcon}
                    />
                  )}
                  <div className={styles.bridgeContentItemText}>
                    {connector.name}
                    {connector.id === 'walletConnect' && (
                      <Tag
                        color={THEME_CONFIG.colorSecondary}
                        className={styles.bridgeContentItemTag}
                      >
                        HOT
                      </Tag>
                    )}
                  </div>
                </div>
                <div className={styles.bridgeContentItemRight}>
                  <FaAngleRight
                    className={styles.bridgeContentItemRightIcon}
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
