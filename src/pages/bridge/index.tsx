import React, { useEffect } from "react";
import styles from "./style.less";
import { useModel } from "@umijs/max";
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as LogoTitle } from '@/assets/auth/aime_logo_text.svg';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { Button, Result } from "antd";
import queryString from 'query-string';
import BuyModal from "../chat/detail/buyModal";
import { charactersData } from "@/mocks/character";
import { StartParam } from "@/types";
import LoginModal from "@/components/loginModal";
import TelegramOauth from "@/components/telegram/oauth";

const Bridge: React.FC = () => {
  const { telegramDataString, setTelegramOauthModalVisible } = useModel('useTelegram');
  const { address, signature, walletBinded, walletModalVisible, setWalletModalVisible } = useModel('useWallet');
  const { setCharacter } = useModel('useSetting');

  const [buyModalVisible, setBuyModalVisible] = React.useState<boolean>(false);
  const [transactionHash, setTransactionHash] = React.useState<`0x${string}` | undefined>();

  const { chain: currentChain } = useNetwork();
  const { chains } = useSwitchNetwork();
  const { isConnected } = useAccount();

  const search = queryString.parse(window.location.search);

  useEffect(() => {
    if (search?.characterId) {
      setCharacter(charactersData.get(search?.characterId as string) ?? {});
    }
  }, [search]);

  useEffect(() => {
    if (!!telegramDataString && !!address && isConnected && currentChain?.id === chains[0]?.id) {
      if (!!search?.action) {
        switch (search?.action) {
          case "bind":
            if (!!address && !!signature && walletBinded) {
              const params: StartParam = {
                characterId: search?.characterId as string,
                address,
                signature,
              };
              const paramsString = JSON.stringify(params).replace(/"/g, '').replace(/'/g, '').replace(/:/g, '__').replace(/,/g, '____').replace(/ /g, '').replace(/{/g, '').replace(/}/g, '');

              window.location.href = `https://t.me/aime_beta_bot/aimeapp?startapp=${paramsString}`;
            }
            break;

          case "buypower":
            setBuyModalVisible(true);
            if (!!address && !!transactionHash) {
              const params: StartParam = {
                characterId: search?.characterId as string,
                address,
              };
              const paramsString = JSON.stringify(params).replace(/"/g, '').replace(/'/g, '').replace(/:/g, '__').replace(/,/g, '&').replace(/ /g, '').replace(/{/g, '').replace(/}/g, '');

              window.location.href = `https://t.me/aime_beta_bot/aimeapp?startapp=${paramsString}`;
            }
            break;
        }
      }
    }
  }, [address, signature, !!telegramDataString, isConnected, currentChain?.id !== chains[0]?.id, transactionHash]);

  return (
    <div className={styles.bridgeContainer}>
      {!!telegramDataString && !!search?.action && (
        <>
          <LoginModal
            visible={true}
            setVisible={setWalletModalVisible}
            closeable={false}
          />
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <Logo />
            </div>
            <div className={styles.title}>
              <LogoTitle />
            </div>
          </div>
        </>
      )}
      {(!telegramDataString || !search?.action) && (
        <>
          <TelegramOauth
            visible={true}
            setVisible={setTelegramOauthModalVisible}
          />
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <Logo />
            </div>
            <div className={styles.title}>
              <LogoTitle />
            </div>
          </div>
        </>
      )}
      <BuyModal
        visible={buyModalVisible}
        setVisible={setBuyModalVisible}
        closeable={false}
        transactionHash={transactionHash}
        setTransactionHash={setTransactionHash}
      />
    </div>
  )
};

export default Bridge;
