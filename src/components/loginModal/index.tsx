import React, { useEffect } from "react";
import styles from "./style.less";
import { Modal } from "antd";
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { useModel } from "@umijs/max";
import Loading from "./loading";
import ConnectWallet from "./connectWallet";
import SwitchNetwork from "./switchNetwork";
import SignMessage from "./signMessage";
import queryString from 'query-string';
import { GetWallet } from "@/services/api";

const LoginModal: React.FC<{
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  closeable?: boolean;
}> = ({ visible, setVisible, closeable }) => {
  const { signature, walletBinded, setAddress } = useModel('useWallet');

  const { chain: currentChain } = useNetwork();
  const { chains } = useSwitchNetwork();

  const { connector, address, isConnected } = useAccount({
    onDisconnect: () => {
      setAddress(undefined);
      localStorage.removeItem('aime:address');
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
        {connector?.id === 'walletConnect' && (
          <div className={styles.walletConnectAccount}>
            <w3m-account-button />
          </div>
        )}
        {(!address || !isConnected) && (
          <ConnectWallet />
        )}
        {!!address && isConnected && currentChain?.id !== chains[0]?.id && (
          <SwitchNetwork />
        )}
        {!!address && isConnected && currentChain?.id === chains[0]?.id && !signature && !walletBinded && (
          <SignMessage />
        )}
        {!!address && isConnected && currentChain?.id === chains[0]?.id && (!!signature || walletBinded) && (
          <Loading />
        )}
      </div>
    </Modal>
  )
};

export default LoginModal;
