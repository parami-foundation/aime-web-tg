import React, { useEffect } from "react";
import styles from "./style.less";
import { Button, Modal, notification } from "antd";
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { useModel } from "@umijs/max";
import Loading from "./loading";
import ConnectWallet from "./connectWallet";
import SwitchNetwork from "./switchNetwork";
import SignMessage from "./signMessage";
import queryString from 'query-string';

const LoginModal: React.FC<{
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  closeable?: boolean;
}> = ({ visible, setVisible, closeable }) => {
  const { signature, walletBinded, setAddress } = useModel('useWallet');

  const { chain: currentChain } = useNetwork();
  const { chains } = useSwitchNetwork();
  const { disconnect, error: disconnectError, isSuccess: disconnectSuccess, isLoading: disconnectLoading } = useDisconnect();

  const { address, isConnected } = useAccount({
    onDisconnect: () => {
      setAddress(undefined);
      localStorage.removeItem('aime:address');
    }
  });

  useEffect(() => {
    disconnect();

    if (disconnectSuccess) {
      setAddress(undefined);
      localStorage.removeItem('aime:address');
    }

    if (disconnectError) {
      notification.error({
        key: 'disconnectError',
        message: 'Disconnect Wallet Error',
        description: disconnectError.message,
      });
    }
  }, [disconnectError, disconnectSuccess]);

  const search = queryString.parse(window.location.search);

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
        {!!address && currentChain?.id === chains[0]?.id && (!signature || !walletBinded) && (!!search?.action && search?.action === "bind") && (
          <SignMessage />
        )}
        {!!address && currentChain?.id === chains[0]?.id && ((!!signature && walletBinded) || (!!search?.action && search?.action !== "bind")) && (
          <Loading />
        )}
      </div>
    </Modal>
  )
};

export default LoginModal;
