import React, { useEffect } from "react";
import styles from "./style.less";
import { Modal, message } from "antd";
import { useAccount, useNetwork, useSignMessage, useSwitchNetwork } from 'wagmi';
import { useModel } from "@umijs/max";
import { useSDKContext } from "@tma.js/sdk-react";
import TelegramOauth, { TelegramOauthDataOnauthProps } from "./telegramOauth";
import ConnectWallet from "./connectWallet";
import SwitchNetwork from "./switchNetwork";
import SignMessage from "./signMessage";
import Loading from "./loading";

const LoginModal: React.FC<{
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  closeable?: boolean;
}> = ({ visible, setVisible, closeable }) => {
  const { telegramDataString, setTelegramData, setTelegramDataString, setTelegramAuthType } = useModel('useTelegram');
  const { setSignature, setAddress } = useModel('useAccess');

  const { data: signature, error: signMsgError, isLoading: signMsgLoading, signMessage } = useSignMessage();
  const { chain: currentChain } = useNetwork();
  const { chains } = useSwitchNetwork();
  const { error: tmaError } = useSDKContext();

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

  useEffect(() => {
    if (!!signature && !signMsgLoading && !signMsgError) {
      setSignature(signature);
    }
  }, [signature, signMsgLoading, signMsgError]);

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
        {!telegramDataString && !!tmaError && (
          <TelegramOauth
            dataOnauth={(response: TelegramOauthDataOnauthProps) => {
              setTelegramData(response);
              setTelegramAuthType('oauth2');
              let initDataString = "";
              for (let key in response) {
                if (initDataString != "") {
                  initDataString += "&";
                }
                initDataString +=
                  key + "=" + encodeURIComponent((response as any)[key]);
              }
              setTelegramDataString(initDataString);
            }}
          />
        )}
        {!!telegramDataString && !isConnected && (
          <ConnectWallet />
        )}
        {!!telegramDataString && isConnected && currentChain?.id !== chains[0]?.id && (
          <SwitchNetwork />
        )}
        {!!telegramDataString && isConnected && currentChain?.id === chains[0]?.id && !signature && (
          <SignMessage
            error={signMsgError}
            isLoading={signMsgLoading}
            signMessage={signMessage}
          />
        )}
        {!!telegramDataString && isConnected && currentChain?.id === chains[0]?.id && !!signature && (
          <Loading />
        )}
      </div>
    </Modal>
  )
};

export default LoginModal;
