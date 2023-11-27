import React from "react";
import styles from "../style.less";
import { useSwitchNetwork } from "wagmi";
import { ReactComponent as RefreshIcon } from '@/assets/icon/refresh.svg';
import { FaAngleRight } from "react-icons/fa";
import { Button, ConfigProvider, theme } from "antd";
import { THEME_CONFIG } from "@/constants/theme";

const SwitchNetwork: React.FC = () => {
  const { chains, switchNetworkAsync } = useSwitchNetwork();

  return (
    <>
      <div className={styles.bridgeHeader}>
        Change Network
        <div className={styles.bridgeHeaderDescription}>
          Please change your network to {chains[0]?.name}
        </div>
      </div>
      <div className={styles.bridgeContent}>
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
              switchNetworkAsync?.(chains[0]?.id);
            }}
          >
            <div className={styles.bridgeContentItemLeft}>
              <RefreshIcon
                className={styles.bridgeContentItemIcon}
              />
              <div className={styles.bridgeContentItemText}>
                Switch Network
              </div>
            </div>
            <div className={styles.bridgeContentItemRight}>
              <FaAngleRight
                className={styles.bridgeContentItemRightIcon}
              />
            </div>
          </Button>
        </ConfigProvider>
      </div>
    </>
  )
};

export default SwitchNetwork;
