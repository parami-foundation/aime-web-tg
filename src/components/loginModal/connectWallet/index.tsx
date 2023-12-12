import React, { useEffect } from "react";
import styles from '../style.less';
import { FaAngleRight } from "react-icons/fa";
import { useModel } from "@umijs/max";
import { useAccount, useConnect } from "wagmi";
import { Button, ConfigProvider, notification, theme } from "antd";
import { ReactComponent as MetamaskIcon } from "@/assets/brand/metamask.svg";
import { ReactComponent as CoinbaseIcon } from "@/assets/brand/coinbase.svg";
import { ReactComponent as WalletConnectIcon } from "@/assets/brand/walletconnect.svg";
import { ReactComponent as InjectedIcon } from "@/assets/brand/injected.svg";
import { THEME_CONFIG } from "@/constants/theme";

const ConnectWallet: React.FC = () => {
  const { wagmiInitialized } = useModel("useWagmi");
  const { setAddress } = useModel("useWallet");

  const { connector, isReconnecting } = useAccount();
  const { connect, connectors, isLoading, error, pendingConnector } =
    useConnect({
      onSuccess: (account) => {
        setAddress(account?.account);
      },
    });

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
        <div className={styles.loginModalHeaderIcon}>
          <img
            className={styles.loginModalHeaderIconImg}
            src={require("@/assets/icon/wallet.png")}
            alt="icon"
          />
        </div>
        <div className={styles.loginModalHeaderTitle}>
          Log in with wallet
        </div>
      </div>
      <div className={styles.loginModalContent}>
        {connectors.map((x) => {
          return (
            <ConfigProvider
              theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                  wireframe: false,
                  colorPrimary: THEME_CONFIG.colorGray,
                  borderRadius: THEME_CONFIG.borderRadius,
                  boxShadow: THEME_CONFIG.boxShadow,
                },
              }}
              key={x.name}
            >
              <Button
                block
                type="primary"
                size="large"
                className={styles.loginModalContentItem}
                disabled={!x.ready || isReconnecting || connector?.id === x.id}
                onClick={() => connect({ connector: x })}
                key={x.name}
              >
                <div className={styles.loginModalContentItemLeft}>
                  {x?.id === 'metaMask' && (
                    <MetamaskIcon
                      className={styles.loginModalContentItemIcon}
                    />
                  )}
                  {x?.id === 'coinbaseWallet' && (
                    <CoinbaseIcon
                      className={styles.loginModalContentItemIcon}
                    />
                  )}
                  {x?.id === 'walletConnect' && (
                    <WalletConnectIcon
                      className={styles.loginModalContentItemIcon}
                    />
                  )}
                  {x?.id === 'injected' && (
                    <InjectedIcon
                      className={styles.loginModalContentItemIcon}
                    />
                  )}
                  <div className={styles.loginModalContentItemText}>
                    {x.id === 'injected' ? (wagmiInitialized ? x.name : x.id) : x.name}
                    {wagmiInitialized && !x.ready && ' (unsupported)'}
                    {isLoading && x.id === pendingConnector?.id && '…'}
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
