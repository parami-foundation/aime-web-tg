import React, { useEffect, useState } from "react";
import styles from "./style.less";
import { Image, Modal, notification } from "antd";
import { GiBuyCard, GiSellCard } from "react-icons/gi";
import { FaAngleRight } from "react-icons/fa";
import classNames from "classnames";
import { useModel } from "@umijs/max";
import Buy from "./buy";
import Sell from "./sell";
import { useAccount, useContractRead, useDisconnect } from "wagmi";
import { AIME_CONTRACT, DEBUG, NETWORK_CONFIG } from "@/constants/global";
import { formatEther } from "viem";

const Index: React.FC<{
  setSelectMode: React.Dispatch<React.SetStateAction<string | undefined>>;
}> = ({ setSelectMode }) => {
  const { address } = useModel("useWallet");
  const { character } = useModel("useSetting");

  const [balance, setBalance] = React.useState<bigint>(0n);
  const [sellPriceAfterFee, setSellPriceAfterFee] = React.useState<bigint>(0n);
  const [tokenPrice, setTokenPrice] = React.useState<number>(0);

  const powerBalance: {
    data?: bigint;
    isError: boolean;
    isLoading: boolean;
  } = useContractRead({
    address: `0x${AIME_CONTRACT.Optimism.Powers}`,
    abi: require("@/abis/AIMePowers.json"),
    functionName: "powerBalance",
    args: [`0x${character?.wallet?.optimism}`, address],
    onSuccess: (data) => {
      setBalance(data ?? 0n);
    }
  });

  const getSellPriceAfterFee: {
    data?: bigint;
    isError: boolean;
    isLoading: boolean;
  } = useContractRead({
    address: `0x${AIME_CONTRACT.Optimism.Powers}`,
    abi: require("@/abis/AIMePowers.json"),
    functionName: "getSellPriceAfterFee",
    args: [`0x${character?.wallet?.optimism}`, balance ?? 0n],
    onSuccess: (data) => {
      setSellPriceAfterFee(data ?? 0n);
    }
  });

  return (
    <div className={styles.indexModalContainer}>
      <div className={styles.indexModalHeader}>
        <div className={styles.indexModalHeaderIcon}>
          <img
            className={styles.indexModalHeaderIconImg}
            src={require("@/assets/icon/trade.png")}
            alt="icon"
          />
        </div>
        <div className={styles.indexModalHeaderTitle}>
          Trade Power
        </div>
      </div>
      <div className={styles.indexModalContent}>
        <div className={styles.indexModalContentCharacter}>
          <div className={styles.indexModalContentCharacterLeft}>
            <div className={styles.indexModalContentCharacterLeftAvatar}>
              <Image
                className={styles.indexModalContentCharacterLeftAvatarImg}
                src={character?.avatar_url}
                fallback={require('@/assets/me/avatar.png')}
                alt="avatar"
              />
            </div>
            <div className={styles.indexModalContentCharacterLeftName}>
              {character?.name}
            </div>
          </div>
          <div className={styles.indexModalContentCharacterRight}>
            <div className={styles.indexModalContentCharacterRightTitle}>
              You own {!!address && (balance?.toString() ?? "0")} power:
            </div>
            <div className={styles.indexModalContentCharacterRightPower}>
              {Number(formatEther(balance ?? 0n))?.toFixed(6)} ETH
            </div>
          </div>
        </div>
        <div
          className={styles.indexModalContentItem}
          onClick={() => setSelectMode("buy")}
        >
          <div className={styles.indexModalContentItemLeft}>
            <div className={classNames(styles.indexModalContentItemIcon, styles.indexModalContentItemIconBuy)}>
              <GiBuyCard
                className={styles.indexModalContentItemIconImg}
              />
            </div>
            <div className={styles.indexModalContentItemTitle}>
              Buy Power
            </div>
          </div>
          <div className={styles.indexModalContentItemRight}>
            <FaAngleRight
              className={styles.indexModalContentItemRightIcon}
            />
          </div>
        </div>
        <div
          className={styles.indexModalContentItem}
          onClick={() => setSelectMode("sell")}
        >
          <div className={styles.indexModalContentItemLeft}>
            <div className={classNames(styles.indexModalContentItemIcon, styles.indexModalContentItemIconSell)}>
              <GiSellCard
                className={styles.indexModalContentItemIconImg}
              />
            </div>
            <div className={styles.indexModalContentItemTitle}>
              Sell Power
            </div>
          </div>
          <div className={styles.indexModalContentItemRight}>
            <FaAngleRight
              className={styles.indexModalContentItemRightIcon}
            />
          </div>
        </div>
      </div>
    </div>
  )
};

const Trade: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  transactionHash: `0x${string}` | undefined;
  setTransactionHash: React.Dispatch<React.SetStateAction<`0x${string}` | undefined>>;
  closeable?: boolean;
  mode?: "buy" | "sell";
}> = ({ visible, setVisible, transactionHash, setTransactionHash, closeable, mode }) => {
  const { bindedAddress } = useModel("useWallet");

  const [selectMode, setSelectMode] = useState<string>();

  const { connector, address: connectAddress } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (!visible) {
      setSelectMode(undefined);
    }
  }, [visible]);

  useEffect(() => {
    DEBUG && console.log("bindedAddress", bindedAddress);
    DEBUG && console.log("connectAddress", connectAddress);
    if (!!bindedAddress && !!connectAddress && bindedAddress !== connectAddress) {
      notification.error({
        key: 'walletError',
        message: 'Wallet Error',
        description: `Please use the wallet you binded. And please make sure you are on the right network. ${NETWORK_CONFIG?.chains[0]?.name} is required.`
      });
      disconnect();
      setVisible(false);
    }
  }, [bindedAddress, connectAddress]);

  return (
    <Modal
      centered
      title={null}
      footer={null}
      className={styles.tradeModal}
      open={visible}
      onCancel={() => setVisible(false)}
      closeIcon={closeable ?? true}
      maskClosable={closeable ?? true}
    >
      {connector?.id === 'walletConnect' && (
        <div className={styles.walletConnectAccount}>
          <w3m-account-button />
        </div>
      )}
      {!selectMode && !mode && (
        <Index
          setSelectMode={setSelectMode}
        />
      )}

      {(selectMode === "buy" || mode === "buy") && (
        <Buy
          visible={visible}
          setVisible={setVisible}
          transactionHash={transactionHash}
          setTransactionHash={setTransactionHash}
        />
      )}
      {(selectMode === "sell" || mode === "sell") && (
        <Sell
          visible={visible}
          setVisible={setVisible}
          transactionHash={transactionHash}
          setTransactionHash={setTransactionHash}
        />
      )}
    </Modal>
  )
};

export default Trade;
