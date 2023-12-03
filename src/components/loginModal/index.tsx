import React from "react";
import styles from "./style.less";
import { Modal, message } from "antd";
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { useModel } from "@umijs/max";
import Loading from "./loading";
import ConnectWallet from "./connectWallet";
import SwitchNetwork from "./switchNetwork";
import SignMessage from "./signMessage";

const LoginModal: React.FC<{
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  closeable?: boolean;
}> = ({ visible, setVisible, closeable }) => {
  const { signature, walletBinded } = useModel('useWallet');
  const { accessToken } = useModel('useAccess');

  const { chain: currentChain } = useNetwork();
  const { chains } = useSwitchNetwork();

  const { address, isConnected } = useAccount();

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
        {(!address || !isConnected) && (
          <ConnectWallet />
        )}
        {!!address && currentChain?.id !== chains[0]?.id && (
          <SwitchNetwork />
        )}
        {!!address && currentChain?.id === chains[0]?.id && (!signature || !walletBinded) && (
          <SignMessage />
        )}
        {!!address && currentChain?.id === chains[0]?.id && !!signature && walletBinded && (
          <Loading />
        )}
      </div>
    </Modal>
  )
};

export default LoginModal;
