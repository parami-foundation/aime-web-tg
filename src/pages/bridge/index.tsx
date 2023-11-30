import React, { useEffect } from "react";
import styles from "./style.less";
import { useModel } from "@umijs/max";
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as LogoTitle } from '@/assets/auth/aime_logo_text.svg';
import SwitchNetwork from "./switchNetwork";
import ConnectWallet from "./connectWallet";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { Button, Result } from "antd";
import queryString from 'query-string';
import BuyModal from "../chat/detail/buyModal";
import { charactersData } from "@/mocks/character";
import SignMessage from "./signMessage";
import Loading from "./loading";
import { StartParam } from "@/services/typing";

const Bridge: React.FC = () => {
  const { telegramDataString } = useModel('useTelegram');
  const { setAddress, signature } = useModel('useAccess');
  const { setCharacter } = useModel('useSetting');

  const [buyModalVisible, setBuyModalVisible] = React.useState<boolean>(false);

  const { chain: currentChain } = useNetwork();
  const { chains } = useSwitchNetwork();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    setAddress(address);
  }, [address, isConnected]);

  const search = queryString.parse(window.location.search);

  useEffect(() => {
    if (search?.characterId) {
      setCharacter(charactersData.get(search?.characterId as string) ?? {});
    }
    if (!!telegramDataString && isConnected && currentChain?.id === chains[0]?.id) {
      // setBuyModalVisible(true);
      if (!!address && !!signature) {
        const params: StartParam = {
          characterId: search?.characterId as string,
          address,
          signature,
        };
        const paramsString = JSON.stringify(params).replace(/"/g, "'").replace(/'/g, '').replace(/:/g, '__').replace(/,/g, '&').replace(/ /g, '').replace(/{/g, '').replace(/}/g, '');

        window.location.href = `https://t.me/aime_beta_bot/aimeapp?startapp=${paramsString}`;
      }
    }
  }, [address, signature, search, !!telegramDataString, isConnected, currentChain?.id !== chains[0]?.id]);

  return (
    <div className={styles.bridgeContainer}>
      {!!telegramDataString && (
        <>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <Logo />
            </div>
            <div className={styles.title}>
              <LogoTitle />
            </div>
          </div>
          <div className={styles.contentContainer}>
            {(!address || !isConnected) && (
              <ConnectWallet />
            )}
            {address && currentChain?.id !== chains[0]?.id && (
              <SwitchNetwork />
            )}
            {address && currentChain?.id === chains[0]?.id && !signature && (
              <SignMessage />
            )}
            {address && currentChain?.id === chains[0]?.id && !!signature && (
              <Loading />
            )}
          </div>
        </>
      )}
      {!telegramDataString && (
        <Result
          icon={
            <div className={styles.logoContainer}>
              <div className={styles.logo}>
                <Logo />
              </div>
              <div className={styles.title}>
                <LogoTitle />
              </div>
            </div>
          }
          status="error"
          title="SDK init error"
          subTitle="SDK init function is not yet called."
          extra={[
            <Button
              type="primary"
              key="retry"
              size='large'
              onClick={() => {
                window.location.reload();
              }}
            >
              Retry
            </Button>,
          ]}
        />
      )}
      <BuyModal
        visible={buyModalVisible}
        setVisible={setBuyModalVisible}
        closeable={false}
      />
    </div>
  )
};

export default Bridge;
