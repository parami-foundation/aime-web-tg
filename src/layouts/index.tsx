import { Outlet } from 'umi';
import styles from './style.less';
import { WALLETCONNECT_CONFIG } from '@/constants/walletconnect';
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { Button, ConfigProvider, Result, Spin, Typography, theme } from 'antd';
import { WagmiConfig } from 'wagmi';
import { THEME_CONFIG } from '@/constants/theme';
import { SDKProvider, useInitData, useSDK } from '@tma.js/sdk-react';
import { useEffect, useMemo } from 'react';

const Layout: React.FC = () => {
  const { Paragraph } = Typography;

  const wagmiConfig = defaultWagmiConfig({
    chains: WALLETCONNECT_CONFIG.chains,
    projectId: WALLETCONNECT_CONFIG.projectId,
    metadata: WALLETCONNECT_CONFIG.metadata,
  });

  createWeb3Modal({
    wagmiConfig: wagmiConfig,
    projectId: WALLETCONNECT_CONFIG.projectId,
    chains: WALLETCONNECT_CONFIG.chains,
  });

  const { didInit, components, error } = useSDK();

  const errorMessage = useMemo<null | string>(() => {
    if (!error) {
      return null;
    }
    return error instanceof Error ? error.message : 'Unknown error';
  }, [error]);

  // Displays current application init data.
  useEffect(() => {
    if (!!didInit) {
      const initData = useInitData();
      const initDataJson = useMemo(() => {
        if (!initData) {
          return 'Init data is empty.';
        }
        const { authDate, chat, hash, canSendAfter, queryId, receiver, user, startParam } = initData;

        return JSON.stringify({
          authDate,
          chat,
          hash,
          canSendAfter,
          queryId,
          receiver,
          user,
          startParam,
        }, null, ' ');
      }, [initData]);

      console.log('initDataJson', initDataJson);
    }
  }, [didInit]);

  return (
    <SDKProvider
      initOptions={{
        debug: true,
        cssVars: true,
      }}
    >
      <WagmiConfig
        config={wagmiConfig}
      >
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            token: {
              wireframe: false,
              colorPrimary: THEME_CONFIG.colorPrimary,
              borderRadius: THEME_CONFIG.borderRadius,
              boxShadow: THEME_CONFIG.boxShadow,
            },
          }}
        >
          {/* {!didInit ? (
            <Result
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
            >
              <Paragraph>
                {errorMessage}
              </Paragraph>
            </Result>
          ) : !components ? (
            <Spin tip="Loading" size="large">
              <div className="content" />
            </Spin>
          ) : (
            <div className={styles.layoutContainer}>
              <Outlet />
            </div>
          )} */}
          <div className={styles.layoutContainer}>
            <Outlet />
          </div>
        </ConfigProvider>
      </WagmiConfig>
    </SDKProvider>
  )
};

export default Layout;
