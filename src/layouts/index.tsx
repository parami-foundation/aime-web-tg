import { Outlet, useModel } from '@umijs/max';
import styles from './style.less';
import { WALLETCONNECT_CONFIG } from '@/constants/walletconnect';
import { ConfigProvider, theme } from 'antd';
import { THEME_CONFIG } from '@/constants/theme';
import { SDKProvider } from '@tma.js/sdk-react';
import { DisplayGate } from '@/components/telegram/displayGate';
import { TMAInitData } from '@/components/telegram/initData';
import { Web3Modal } from '@web3modal/react'
import { WagmiConfig } from 'wagmi'
import LoginModal from '@/components/loginModal';

const Layout: React.FC = () => {
  const { walletModalOpen, setWalletModalOpen } = useModel('wagmiClient');

  const { wagmiConfig, ethereumClient } = useModel('wagmiClient');

  return (
    <SDKProvider
      initOptions={{
        debug: true,
        cssVars: true,
      }}
    >
      {!!wagmiConfig && !!ethereumClient && (
        <>
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
                  <div className={styles.wrapperContainer}>
                    <Outlet />
                    <LoginModal
                      visible={walletModalOpen}
                      onClose={() => setWalletModalOpen(false)}
                    />
                  </div>
                </div>
              </DisplayGate>
            </ConfigProvider>
          </WagmiConfig>

          <Web3Modal projectId={WALLETCONNECT_CONFIG.projectId} ethereumClient={ethereumClient} />
        </>
      )}
    </SDKProvider>
  )
};

export default Layout;
