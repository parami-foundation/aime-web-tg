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
import { notification } from "antd";
import { AccessLayout } from "@/layouts/access";

const Bridge: React.FC = () => {
  const { telegramDataString, telegramCloudStorage, setTelegramOauthModalVisible, setTelegramAuthType, setTelegramDataString } = useModel('useTelegram');
  const { address, signature, walletBinded, setWalletModalVisible, setAddress } = useModel('useWallet');
  const { setCharacter } = useModel('useSetting');
  const { accessToken, setAccessToken, setAccessTokenExpire } = useModel('useAccess');

  const [buyModalVisible, setBuyModalVisible] = React.useState<boolean>(false);
  const [transactionHash, setTransactionHash] = React.useState<`0x${string}` | undefined>();

  const { chain: currentChain } = useNetwork();
  const { chains } = useSwitchNetwork();

  const search = queryString.parse(window.location.search);

  const { disconnect, error: disconnectError, isSuccess: disconnectSuccess } = useDisconnect();
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
    const now = new Date().getTime();

    if (!!search?.access_token_expire && parseInt(search?.access_token_expire as string) > now) {
      setAccessTokenExpire(parseInt(search?.access_token_expire as string));
      localStorage.setItem('aime:accessToken:expire', search?.access_token_expire as string);
      telegramCloudStorage?.set('aime:accessToken:expire', search?.access_token_expire as string);

      if (!!search?.access_token) {
        setAccessToken(search?.access_token as string);
        localStorage.setItem('aime:accessToken', search?.access_token as string);
        telegramCloudStorage?.set('aime:accessToken', search?.access_token as string);
      }

      if (!!search?.telegramDataString) {
        setTelegramOauthModalVisible(false);
        setTelegramDataString(decodeURIComponent(search?.telegramDataString as string));
        localStorage.setItem('aime:telegramDataString', decodeURIComponent(search?.telegramDataString as string));
        telegramCloudStorage?.set('aime:telegramDataString', decodeURIComponent(search?.telegramDataString as string));
      }

      if (!!search?.telegramAuthType) {
        setTelegramAuthType(search?.telegramAuthType as string);
        localStorage.setItem('aime:telegramAuthType', search?.telegramAuthType as string);
        telegramCloudStorage?.set('aime:telegramAuthType', search?.telegramAuthType as string);
      }

      if (!!search?.telegramAuthType) {
        setTelegramAuthType(search?.telegramAuthType as string);
        localStorage.setItem('aime:telegramAuthType', search?.telegramAuthType as string);
        telegramCloudStorage?.set('aime:telegramAuthType', search?.telegramAuthType as string);
      }

      if (!!search?.characterId) {
        setCharacter(charactersData.get(search?.characterId as string) ?? {});
      }
    }
  }, []);

  useEffect(() => {
    if (!!search?.action) {
      switch (search?.action) {
        case "bind":
          if (!!address && isConnected && currentChain?.id === chains[0]?.id && (!!signature || walletBinded)) {
            const params: StartParam = {
              characterId: search?.characterId as string,
              address,
              reconnect: true,
            };
            const paramsString = JSON.stringify(params).replace(/"/g, '').replace(/'/g, '').replace(/:/g, '__').replace(/,/g, '____').replace(/ /g, '').replace(/{/g, '').replace(/}/g, '');

            window.location.href = `https://t.me/aime_beta_bot/aimeapp?startapp=${paramsString}`;
          }
          break;

        case "buypower":
          if (!!address && isConnected && currentChain?.id === chains[0]?.id && (!!signature || walletBinded)) {
            setBuyModalVisible(true);
            if (!!transactionHash) {
              const params: StartParam = {
                characterId: search?.characterId as string,
                address,
                reconnect: true,
              };
              const paramsString = JSON.stringify(params).replace(/"/g, '').replace(/'/g, '').replace(/:/g, '__').replace(/,/g, '&').replace(/ /g, '').replace(/{/g, '').replace(/}/g, '');

              window.location.href = `https://t.me/aime_beta_bot/aimeapp?startapp=${paramsString}`;
            }
          } else {
            setBuyModalVisible(false);
          }
          break;

        default:
          notification.error({
            key: 'actionError',
            message: 'Action Error',
            description: 'Please check the action in the URL.',
            duration: 0,
          });
      }
    } else {
      notification.error({
        key: 'actionError',
        message: 'Action Error',
        description: 'Please check the action in the URL.',
        duration: 0,
      });
    }
  }, [address, currentChain, signature, walletBinded, transactionHash]);

  return (
    <AccessLayout>
      <div className={styles.bridgeContainer}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <div className={styles.title}>
            <LogoTitle />
          </div>
        </div>
        {!!accessToken && (
          <>
            <LoginModal
              visible={true}
              setVisible={setWalletModalVisible}
              closeable={false}
            />
            <BuyModal
              visible={buyModalVisible}
              setVisible={setBuyModalVisible}
              closeable={false}
              transactionHash={transactionHash}
              setTransactionHash={setTransactionHash}
            />
          </>
        )}
      </div>
    </AccessLayout>
  )
};

export default Bridge;
