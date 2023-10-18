import React, { useEffect } from "react";
import styles from "./style.less";
import { Button, Modal, Tag, notification } from "antd";
import { ReactComponent as StampIcon } from '@/assets/icon/stamp.svg';
import { BIND_WALLET_MESSAGE } from "@/constants/global";
import { SignMessageArgs } from "wagmi/actions";

export interface SignMessageProps {
  error: Error | null;
  isLoading: boolean;
  signMessage: (args?: SignMessageArgs | undefined) => void;
};

const SignMessage: React.FC<SignMessageProps> = ({ error, isLoading, signMessage }) => {
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
    <Modal
      centered
      open={true}
      closable={false}
      footer={null}
    >
      <div className={styles.signMessageContainer}>
        <StampIcon className={styles.signMessageIcon} />
        <div className={styles.signMessageTitle}>
          Need to verify your wallet
        </div>
        <div className={styles.signMessageContent}>
          Please sign the message <Tag>{BIND_WALLET_MESSAGE}</Tag> with your wallet
        </div>
      </div>
      <Button
        block
        loading={isLoading}
        type="primary"
        size="large"
        className={styles.button}
        onClick={() => {
          signMessage({
            message: BIND_WALLET_MESSAGE
          })
        }}
      >
        Sign Message
      </Button>
    </Modal>
  )
};

export default SignMessage;
