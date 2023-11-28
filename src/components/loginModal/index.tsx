import React from "react";
import styles from "./style.less";
import { Modal, message } from "antd";
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { useModel } from "@umijs/max";
import Loading from "./loading";
import ConnectWallet from "./connectWallet";
import SwitchNetwork from "./switchNetwork";

const LoginModal: React.FC<{
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  closeable?: boolean;
}> = ({ visible, setVisible, closeable }) => {
  const { accessToken, setAddress } = useModel('useAccess');

  const { chain: currentChain } = useNetwork();
  const { chains } = useSwitchNetwork();

  const { address, isConnected } = useAccount({
    onConnect: () => {
      message.success({
        key: 'connectWallet',
        content: 'Connect wallet success'
      });
      setAddress(address);
    },
    onDisconnect: () => {
      message.success({
        key: 'disconnectWallet',
        content: 'Disconnect wallet success'
      });
      setAddress(undefined);
    }
  });

  return (
    <Modal
      centered
      title={null}
      footer={null}
      className={styles.loginModal}
      open={visible}
      onCancel={() => setVisible(false)}
      closable={closeable ?? false}
      maskClosable={closeable ?? false}
    >
      <div className={styles.loginModalContainer}>
        {!!accessToken && !isConnected && !address && (
          <ConnectWallet />
        )}
        {!!accessToken && isConnected && currentChain?.id !== chains[0]?.id && !!address && (
          <SwitchNetwork />
        )}
        {!!accessToken && isConnected && currentChain?.id === chains[0]?.id && !!address && (
          <Loading />
        )}
      </div>
    </Modal>
  )
};

export default LoginModal;
