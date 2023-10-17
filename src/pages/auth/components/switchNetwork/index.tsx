import React from "react";
import styles from "./style.less";
import { useSwitchNetwork } from "wagmi";
import { Button, Modal } from "antd";
import { ReactComponent as RefreshIcon } from '@/assets/icon/refresh.svg';

export interface SwitchNetworkProps { };

const SwitchNetwork: React.FC<SwitchNetworkProps> = () => {
  const { chains, switchNetworkAsync } = useSwitchNetwork();

  return (
    <Modal
      centered
      open={true}
      closable={false}
      footer={null}
    >
      <div className={styles.changeNetworkContainer}>
        <RefreshIcon className={styles.changeNetworkIcon} />
        <div className={styles.changeNetworkTitle}>
          Change Network
        </div>
        <div className={styles.changeNetworkContent}>
          Please change your network to {chains[0]?.name}
        </div>
      </div>
      <Button
        block
        type="primary"
        size="large"
        className={styles.button}
        onClick={() => {
          switchNetworkAsync?.(chains[0]?.id);
        }}
      >
        Switch Network
      </Button>
    </Modal>
  )
};

export default SwitchNetwork;
