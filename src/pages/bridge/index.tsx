import React, { useEffect } from "react";
import styles from "./style.less";
import { useModel } from "@umijs/max";
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as LogoTitle } from '@/assets/auth/aime_logo_text.svg';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import queryString from 'query-string';
import BuyModal from "../chat/detail/buyModal";
import { charactersData } from "@/mocks/character";
import { StartParam } from "@/types";
import LoginModal from "@/components/loginModal";
import TelegramOauth from "@/components/telegram/oauth";
import { notification } from "antd";

const Bridge: React.FC = () => {
  const { telegramDataString, telegramCloudStorage, setTelegramOauthModalVisible, setTelegramAuthType, setTelegramDataString } = useModel('useTelegram');
  const { address, signature, walletBinded, setWalletModalVisible, setAddress } = useModel('useWallet');
  const { setCharacter } = useModel('useSetting');
  const { setAccessToken, setAccessTokenExpire } = useModel('useAccess');


  const [buyModalVisible, setBuyModalVisible] = React.useState<boolean>(false);
  const [transactionHash, setTransactionHash] = React.useState<`0x${string}` | undefined>();

  const { chain: currentChain } = useNetwork();
  const { chains } = useSwitchNetwork();

  const search = queryString.parse(window.location.search);

  const { disconnect, error: disconnectError, isSuccess: disconnectSuccess, isLoading: disconnectLoading } = useDisconnect();

  const { isConnected } = useAccount({
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

  useEffect(() => {
    if (search?.access_token_expire) {
      setAccessTokenExpire(parseInt(search?.access_token_expire as string));
      localStorage.setItem('aime:accessToken:expire', search?.access_token_expire as string);
      telegramCloudStorage?.set('aime:accessToken:expire', search?.access_token_expire as string);
    }

    if (search?.access_token) {
      setAccessToken(search?.access_token as string);
      localStorage.setItem('aime:accessToken', search?.access_token as string);
      telegramCloudStorage?.set('aime:accessToken', search?.access_token as string);
    }

    if (search?.telegramDataString) {
      setTelegramOauthModalVisible(false);
      setTelegramDataString(decodeURIComponent(search?.telegramDataString as string));
      localStorage.setItem('aime:telegramDataString', decodeURIComponent(search?.telegramDataString as string));
      telegramCloudStorage?.set('aime:telegramDataString', decodeURIComponent(search?.telegramDataString as string));
    }

    if (search?.telegramAuthType) {
      setTelegramAuthType(search?.telegramAuthType as string);
      localStorage.setItem('aime:telegramAuthType', search?.telegramAuthType as string);
      telegramCloudStorage?.set('aime:telegramAuthType', search?.telegramAuthType as string);
    }

    if (search?.characterId) {
      setCharacter(charactersData.get(search?.characterId as string) ?? {});
    }
  }, []);

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
    } else {
      setBuyModalVisible(false);
    }
  }, [address, signature, walletBinded, !!telegramDataString, isConnected, currentChain?.id !== chains[0]?.id, transactionHash]);

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
