import { Outlet } from 'umi';
import styles from './style.less';
import { WALLETCONNECT_CONFIG } from '@/constants/walletconnect';
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { ConfigProvider, theme } from 'antd';
import { WagmiConfig } from 'wagmi';
import { THEME_CONFIG } from '@/constants/theme';
import { SDKProvider } from '@tma.js/sdk-react';
import { DisplayGate } from '@/components/Telegram/displayGate';
import { InitData } from '@/components/Telegram/initData';

const Layout: React.FC = () => {
  const wagmiConfig = defaultWagmiConfig({
    chains: WALLETCONNECT_CONFIG.chains,
    projectId: WALLETCONNECT_CONFIG.projectId,
    metadata: WALLETCONNECT_CONFIG.metadata,
  });

  createWeb3Modal({
    wagmiConfig: wagmiConfig,
    projectId: WALLETCONNECT_CONFIG.projectId,
    defaultChain: WALLETCONNECT_CONFIG.defaultChain,
    chains: WALLETCONNECT_CONFIG.chains,
  });

  return (
    <WagmiConfig
      config={wagmiConfig}
    >
      <SDKProvider
        initOptions={{
          debug: true,
          cssVars: true,
        }}
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
          <DisplayGate>
            <InitData />
            <div className={styles.layoutContainer}>
              <Outlet />
            </div>
          </DisplayGate>
        </ConfigProvider>
      </SDKProvider>
    </WagmiConfig>
  )
};

export default Layout;
