import React, { useEffect } from "react";
import styles from "../style.less";
import { Button, ConfigProvider, Tag, notification, theme } from "antd";
import { ReactComponent as StampIcon } from '@/assets/icon/stamp.svg';
import { BIND_WALLET_MESSAGE } from "@/constants/global";
import { FaAngleRight } from "react-icons/fa";
import { THEME_CONFIG } from "@/constants/theme";
import { useSignMessage } from "wagmi";
import { useModel } from "@umijs/max";

const SignMessage: React.FC = () => {
  const { setSignature } = useModel('useAccess');

  const { error, isLoading, signMessage } = useSignMessage({
    onSuccess: (data) => {
      setSignature(data);
    },
  });

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
      <div className={styles.bridgeHeader}>
        Need to verify your wallet
        <div className={styles.bridgeHeaderDescription}>
          Please sign the message <Tag>{BIND_WALLET_MESSAGE}</Tag> with your wallet
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
            loading={isLoading}
            className={styles.bridgeContentItem}
            onClick={() => {
              signMessage({
                message: BIND_WALLET_MESSAGE
              })
            }}
          >
            <div className={styles.bridgeContentItemLeft}>
              <StampIcon
                className={styles.bridgeContentItemIcon}
              />
              <div className={styles.bridgeContentItemText}>
                Sign Message
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

export default SignMessage;