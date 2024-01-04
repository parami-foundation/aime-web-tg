import React, { useEffect } from "react";
import styles from "./style.less";
import { useModel } from "@umijs/max";
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as LogoTitle } from '@/assets/auth/aime_logo_text.svg';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import queryString from 'query-string';
import { charactersData } from "@/mocks/character";
import { StartParam } from "@/types";
import LoginModal from "@/components/login";
import { notification } from "antd";
import { AccessLayout } from "@/layouts/access";
import Trade from "@/components/trade";

const Bridge: React.FC = () => {
  const { telegramCloudStorage, setTelegramOauthModalVisible, setTelegramAuthType, setTelegramDataString } = useModel('useTelegram');
  const { signature, walletBinded, setWalletModalVisible, setAddress } = useModel('useWallet');
  const { setCharacter } = useModel('useSetting');
  const { accessToken, setAccessToken, setAccessTokenExpire } = useModel('useAccess');

  const [tradeModalVisible, setTradeModalVisible] = React.useState<boolean>(false);
  const [transactionHash, setTransactionHash] = React.useState<`0x${string}` | undefined>();
  const [tradeMode, setTradeMode] = React.useState<'buy' | 'sell' | undefined>();

  const { chain: currentChain } = useNetwork();
  const { chains } = useSwitchNetwork();

  const search = queryString.parse(window.location.search);

  const { disconnect, error: disconnectError, isSuccess: disconnectSuccess } = useDisconnect();
  const { address: connectAddress, isConnected } = useAccount({
    onConnect: (data) => {
      setAddress(data.address);
      localStorage.setItem('aime:address', data.address as string);
    },
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
          if (!!connectAddress && isConnected && currentChain?.id === chains[0]?.id && (!!signature || walletBinded)) {
            const params: StartParam = {
              characterId: search?.characterId as string,
              address: connectAddress,
              reconnect: true,
            };
            const paramsString = JSON.stringify(params).replace(/"/g, '').replace(/'/g, '').replace(/:/g, '__').replace(/,/g, '____').replace(/ /g, '').replace(/{/g, '').replace(/}/g, '');

            window.location.href = `https://t.me/aime_beta_bot/aimeapp?startapp=${paramsString}`;
          }
          break;

        case "trade":
          if (!!connectAddress && isConnected && currentChain?.id === chains[0]?.id && (!!signature || walletBinded)) {
            setTradeModalVisible(true);
            if (!!transactionHash) {
              const params: StartParam = {
                characterId: search?.characterId as string,
                address: connectAddress,
                reconnect: true,
              };
              const paramsString = JSON.stringify(params).replace(/"/g, '').replace(/'/g, '').replace(/:/g, '__').replace(/,/g, '&').replace(/ /g, '').replace(/{/g, '').replace(/}/g, '');

              window.location.href = `https://t.me/aime_beta_bot/aimeapp?startapp=${paramsString}`;
            }
          } else {
            setTradeModalVisible(false);
            setTradeMode(undefined);
          }
          break;

        case "buypower":
          if (!!connectAddress && isConnected && currentChain?.id === chains[0]?.id && (!!signature || walletBinded)) {
            setTradeMode('buy');
            setTradeModalVisible(true);
            if (!!transactionHash) {
              const params: StartParam = {
                characterId: search?.characterId as string,
                address: connectAddress,
                reconnect: true,
              };
              const paramsString = JSON.stringify(params).replace(/"/g, '').replace(/'/g, '').replace(/:/g, '__').replace(/,/g, '&').replace(/ /g, '').replace(/{/g, '').replace(/}/g, '');

              window.location.href = `https://t.me/aime_beta_bot/aimeapp?startapp=${paramsString}`;
            }
          } else {
            setTradeModalVisible(false);
            setTradeMode(undefined);
          }
          break;

        case "sellpower":
          if (!!connectAddress && isConnected && currentChain?.id === chains[0]?.id && (!!signature || walletBinded)) {
            setTradeMode('sell');
            setTradeModalVisible(true);
            if (!!transactionHash) {
              const params: StartParam = {
                characterId: search?.characterId as string,
                address: connectAddress,
                reconnect: true,
              };
              const paramsString = JSON.stringify(params).replace(/"/g, '').replace(/'/g, '').replace(/:/g, '__').replace(/,/g, '&').replace(/ /g, '').replace(/{/g, '').replace(/}/g, '');

              window.location.href = `https://t.me/aime_beta_bot/aimeapp?startapp=${paramsString}`;
            }
          } else {
            setTradeModalVisible(false);
            setTradeMode(undefined);
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
  }, [connectAddress, currentChain, signature, walletBinded, transactionHash]);

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
            <Trade
              visible={tradeModalVisible}
              setVisible={setTradeModalVisible}
              closeable={false}
              transactionHash={transactionHash}
              setTransactionHash={setTransactionHash}
              mode={tradeMode}
            />
          </>
        )}
      </div>
    </AccessLayout>
  )
};

export default Bridge;
