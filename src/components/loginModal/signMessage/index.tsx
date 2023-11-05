import React, { useEffect } from "react";
import styles from "../style.less";
import { Button, ConfigProvider, Tag, notification, theme } from "antd";
import { ReactComponent as StampIcon } from '@/assets/icon/stamp.svg';
import { BIND_WALLET_MESSAGE } from "@/constants/global";
import { SignMessageArgs } from "wagmi/actions";
import { FaAngleRight } from "react-icons/fa";
import { THEME_CONFIG } from "@/constants/theme";

const SignMessage: React.FC<{
  error: Error | null;
  isLoading: boolean;
  signMessage: (args?: SignMessageArgs | undefined) => void;
}> = ({ error, isLoading, signMessage }) => {
  useEffect(() => {
    if (!!error) {
      notification.error({
        key: 'signMessageError',
        message: 'Sign message failed',
        description: error.message,
      });
    }
  }, [error]);

  return (
    <>
      <div className={styles.loginModalHeader}>
        Need to verify your wallet
        <div className={styles.loginModalHeaderDescription}>
          Please sign the message <Tag>{BIND_WALLET_MESSAGE}</Tag> with your wallet
        </div>
      </div>
      <div className={styles.loginModalContent}>
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
            loading={isLoading}
            className={styles.loginModalContentItem}
            onClick={() => {
              signMessage({
                message: BIND_WALLET_MESSAGE
              })
            }}
          >
            <div className={styles.loginModalContentItemLeft}>
              <StampIcon
                className={styles.loginModalContentItemIcon}
              />
              <div className={styles.loginModalContentItemText}>
                Sign Message
              </div>
            </div>
            <div className={styles.loginModalContentItemRight}>
              <FaAngleRight
                className={styles.loginModalContentItemRightIcon}
              />
            </div>
          </Button>
        </ConfigProvider>
      </div>
    </>
  )
};

export default SignMessage;
