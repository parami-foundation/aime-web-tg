import React, { useEffect } from "react";
import styles from "../style.less";
import { Button, ConfigProvider, Tag, notification, theme } from "antd";
import { ReactComponent as StampIcon } from '@/assets/icon/stamp.svg';
import { BIND_WALLET_MESSAGE } from "@/constants/global";
import { FaAngleRight } from "react-icons/fa";
import { THEME_CONFIG } from "@/constants/theme";
import { useSignMessage } from 'wagmi';
import { recoverMessageAddress } from 'viem';
import { useModel } from "@umijs/max";

const SignMessage: React.FC = () => {
  const { setSignature } = useModel('useAccess');

  const [recoveredAddress, setRecoveredAddress] = React.useState<string>();

  const {
    data: signature,
    variables,
    error,
    isLoading,
    signMessage,
  } = useSignMessage({
    message: BIND_WALLET_MESSAGE,
  });

  useEffect(() => {
    ; (async () => {
      if (variables?.message && signature) {
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature,
        })
        setRecoveredAddress(recoveredAddress);
        setSignature(signature);
      }
    })();
  }, [signature, variables?.message]);

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
            disabled={isLoading}
            className={styles.bridgeContentItem}
            onClick={async () => {
              await signMessage();
            }}
          >
            <div className={styles.bridgeContentItemLeft}>
              <StampIcon
                className={styles.bridgeContentItemIcon}
              />
              <div className={styles.bridgeContentItemText}>
                {isLoading ? 'Check Wallet' : 'Sign Message'}
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