import { Outlet, useModel } from '@umijs/max';
import styles from './style.less';
import { ConfigProvider, theme } from 'antd';
import { THEME_CONFIG } from '@/constants/theme';
import { SDKProvider } from '@tma.js/sdk-react';
import { DisplayGate } from '@/components/telegram/displayGate';
import { TMAInitData } from '@/components/telegram/initData';
import { WagmiConfig } from 'wagmi';

const Layout: React.FC = () => {
  const { wagmiConfig } = useModel('useWagmi');
  const { telegramMiniAppHeight } = useModel('useTelegram');

  return (
    <SDKProvider
      initOptions={{
        debug: true,
        cssVars: true,
        acceptCustomStyles: true,
      }}
    >
      {!!wagmiConfig && (
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
                <TMAInitData>
                  <div
                    className={styles.layoutContainer}
                    style={{
                      height: telegramMiniAppHeight ?? '100%',
                    }}
                  >
                    <div className={styles.wrapperContainer}>
                      <Outlet />
                    </div>
                  </div>
                </TMAInitData>
              </DisplayGate>
            </ConfigProvider>
          </WagmiConfig>
        </>
      )}
    </SDKProvider>
  )
};

export default Layout;
