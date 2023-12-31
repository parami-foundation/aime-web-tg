import { Outlet, useModel } from '@umijs/max';
import styles from './style.less';
import { ConfigProvider, theme } from 'antd';
import { THEME_CONFIG } from '@/constants/theme';
import { SDKProvider } from '@tma.js/sdk-react';
import { DisplayGate } from '@/components/telegram/displayGate';
import { TMAInitData } from '@/components/telegram/initData';
import { WagmiConfig } from 'wagmi';
import { DEBUG } from '@/constants/global';
import eruda from 'eruda';

const Layout: React.FC = () => {
  const { viewport } = useModel('useView');
  const { wagmiConfig } = useModel('useWagmi');

  if (DEBUG) {
    let el = document.createElement('div');
    document.body.appendChild(el);
    eruda.init({
      container: el,
    });
  }

  return (
    <>
      {!!wagmiConfig && (
        <WagmiConfig
          config={wagmiConfig}
        >
          <SDKProvider
            options={{
              cssVars: true,
              acceptCustomStyles: true,
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
                <TMAInitData>
                  <div
                    className={styles.layoutContainer}
                    style={{
                      height: viewport.height || '100vh',
                    }}
                  >
                    <div className={styles.wrapperContainer}>
                      <Outlet />
                    </div>
                  </div>
                </TMAInitData>
              </DisplayGate>
            </ConfigProvider>
          </SDKProvider>
        </WagmiConfig>
      )}
    </>
  )
};

export default Layout;
