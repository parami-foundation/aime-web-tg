import { Outlet } from '@umijs/max';
import styles from './style.less';
import { WALLETCONNECT_CONFIG } from '@/constants/walletconnect';
import { ConfigProvider, theme } from 'antd';
import { THEME_CONFIG } from '@/constants/theme';
import { SDKProvider } from '@tma.js/sdk-react';
import { DisplayGate } from '@/components/telegram/displayGate';
import { TMAInitData } from '@/components/telegram/initData';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'

const Layout: React.FC = () => {
  const { publicClient } = configureChains(WALLETCONNECT_CONFIG.chains, [w3mProvider({ projectId: WALLETCONNECT_CONFIG.projectId })]);
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId: WALLETCONNECT_CONFIG.projectId, chains: WALLETCONNECT_CONFIG.chains }),
    publicClient
  });
  const ethereumClient = new EthereumClient(wagmiConfig, WALLETCONNECT_CONFIG.chains);

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
          <DisplayGate>
            <TMAInitData />
            <div className={styles.layoutContainer}>
              <Outlet />
            </div>
          </DisplayGate>
        </ConfigProvider>
      </WagmiConfig>

      <Web3Modal projectId={WALLETCONNECT_CONFIG.projectId} ethereumClient={ethereumClient} />
    </SDKProvider>
  )
};

export default Layout;
