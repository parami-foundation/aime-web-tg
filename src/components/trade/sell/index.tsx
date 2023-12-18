import React, { useEffect } from "react";
import styles from "./style.less";
import { useModel } from "@umijs/max";
import { useAccount, useBalance, useContractRead, useContractWrite, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { AIME_CONTRACT, DEBUG, NETWORK_CONFIG } from "@/constants/global";
import { Button, InputNumber, message, notification } from "antd";
import { Image } from "antd";
import { formatEther } from "viem";
import classNames from "classnames";
import { AiFillCaretDown, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { CreateTransaction } from "@/services/api";
import { GetTokenPrice } from "@/services/third";
import { RiWalletLine } from "react-icons/ri";
import PurchaseSuccess from "@/components/purchase/success";
import PurchaseFailed from "@/components/purchase/failed";

const Select: React.FC<{
  powerValue: number;
  setPowerValue: React.Dispatch<React.SetStateAction<number>>;
}> = ({ powerValue, setPowerValue }) => {
  const { character } = useModel("useSetting");
  const { address } = useModel("useWallet");

  const [manualInput, setManualInput] = React.useState<number>(0);
  const [balance, setBalance] = React.useState<bigint>(0n);

  const getEthValue = (powerValue: number) => {
    const { data: ethValue }: {
      data?: bigint;
      isError: boolean;
      isLoading: boolean;
    } = useContractRead({
      address: `0x${AIME_CONTRACT.Optimism.Powers}`,
      abi: require("@/abis/AIMePowers.json"),
      functionName: "getSellPriceAfterFee",
      args: [`0x${character?.wallet?.optimism}`, powerValue],
    });

    return ethValue;
  };

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

  return (
    <div className={styles.selectModalContainer}>
      <div className={styles.selectModalHeader}>
        <div className={styles.selectModalHeaderIcon}>
          <img
            className={styles.selectModalHeaderIconImg}
            src={require("@/assets/icon/sale.png")}
            alt="sell"
          />
          <div className={styles.selectModalHeaderIconAvatar}>
            <Image
              className={styles.selectModalHeaderIconAvatarImg}
              src={character?.avatar_url}
              fallback={require('@/assets/me/avatar.png')}
              alt="avatar"
            />
          </div>
        </div>
        <div className={styles.selectModalHeaderTitle}>
          Sale
        </div>
        <div className={styles.selectModalHeaderSubtitle}>
          <b>{character?.name}‘s</b> Power
        </div>
        <div className={styles.selectModalHeaderFlat}>
          1 Power ≈ {formatEther(getEthValue(1) ?? 0n)} ETH
        </div>
      </div>
      <div className={styles.selectModalContent}>
        <div
          className={classNames(styles.selectModalContentItem, manualInput === 1 && styles.selectModalContentItemSelected)}
          onClick={() => {
            setManualInput(1);
          }}
        >
          <div className={styles.selectModalContentItemPrice}>
            {formatEther(getEthValue(1) ?? 0n)} ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            1 Power
          </div>
        </div>
        <div
          className={classNames(styles.selectModalContentItem, manualInput === 10 && styles.selectModalContentItemSelected)}
          onClick={() => {
            setManualInput(10);
          }}
        >
          <div className={styles.selectModalContentItemPrice}>
            {formatEther(getEthValue(10) ?? 0n)} ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            10 Power
          </div>
        </div>
        <div
          className={classNames(styles.selectModalContentItem, manualInput === 30 && styles.selectModalContentItemSelected)}
          onClick={() => {
            setManualInput(30);
          }}
        >
          <div className={styles.selectModalContentItemPrice}>
            {formatEther(getEthValue(30) ?? 0n)} ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            30 Power
          </div>
        </div>
      </div>
      <div className={styles.selectModalContentItemFull}>
        <div className={styles.selectModalContentItemFullLeft}>
          <div className={styles.selectModalContentItemPrice}>
            {formatEther(getEthValue(manualInput) ?? 0n)} ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            {manualInput} Power
          </div>
        </div>
        <div className={styles.selectModalContentItemFullRight}>
          <div className={styles.selectModalContentItemFullControl}>
            <div
              className={styles.selectModalContentItemFullControlMinus}
              onClick={() => {
                if (manualInput > 0) {
                  setManualInput(manualInput - 1);
                }
              }}
            >
              <AiOutlineMinus />
            </div>
            <div className={styles.selectModalContentItemFullControlNumber}>
              <InputNumber
                className={styles.selectModalContentItemFullControlNumberInput}
                bordered={false}
                controls={false}
                min={0}
                max={100}
                defaultValue={0}
                value={manualInput}
                type="number"
                onChange={(e) => {
                  setManualInput(e!);
                }}
              />
            </div>
            <div
              className={styles.selectModalContentItemFullControlPlus}
              onClick={() => {
                if (manualInput < 100) {
                  setManualInput(manualInput + 1);
                }
              }}
            >
              <AiOutlinePlus />
            </div>
          </div>
        </div>
      </div>
      <Button
        block
        type="primary"
        size="large"
        className={styles.selectModalContentItemButton}
        disabled={manualInput === 0}
        onClick={() => {
          setPowerValue(manualInput);
          // if (manualInput <= Number(formatEther(balance ?? 0n))) {
          //   setPowerValue(manualInput);
          // } else {
          //   message.error("You don't have enough power to sell.");
          // }
        }}
      >
        Confirm Sell
      </Button>
    </div>
  );
};

const Detail: React.FC<{
  powerValue: number;
  setSellSuccessVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSellFailedVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<Error>>;
  setTransactionHash: React.Dispatch<React.SetStateAction<`0x${string}` | undefined>>;
  setSellModalVisible: (visible: boolean) => void;
}> = ({ powerValue, setSellSuccessVisible, setSellFailedVisible, setError, setTransactionHash, setSellModalVisible }) => {
  const { accessToken } = useModel("useAccess");
  const { publicClient } = useModel("useWagmi");
  const { character } = useModel("useSetting");

  const [bodyDropdown, setBodyDropdown] = React.useState<boolean>(false);
  const [tokenPrice, setTokenPrice] = React.useState<number>(0);
  const [gas, setGas] = React.useState<bigint>(0n);
  const [powerBalance, setPowerBalance] = React.useState<bigint>(0n);

  const { address } = useAccount();
  const { data: balance, isError: balanceError, isLoading: balanceLoading } = useBalance({
    address: address,
  });
  const { chain: currentChain } = useNetwork();
  const { chains, error: switchNetworkError, isLoading: switchNetworkLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const getPowerBalance: {
    data?: bigint;
    isError: boolean;
    isLoading: boolean;
  } = useContractRead({
    address: `0x${AIME_CONTRACT.Optimism.Powers}`,
    abi: require("@/abis/AIMePowers.json"),
    functionName: "powerBalance",
    args: [`0x${character?.wallet?.optimism}`, address],
    onSuccess: (data) => {
      setPowerBalance(data ?? 0n);
    }
  });

  const { data: ethValue }: {
    data?: bigint;
    isError: boolean;
    isLoading: boolean;
  } = useContractRead({
    address: `0x${AIME_CONTRACT.Optimism.Powers}`,
    abi: require("@/abis/AIMePowers.json"),
    functionName: "getSellPrice",
    args: [`0x${character?.wallet?.optimism}`, powerValue],
  });

  const { data, isLoading, isSuccess, error, write } = useContractWrite({
    address: `0x${AIME_CONTRACT.Optimism.Powers}`,
    abi: require("@/abis/AIMePowers.json"),
    functionName: 'sellPowers',
  });

  useEffect(() => {
    (async () => {
      const gas = await publicClient?.estimateContractGas({
        address: `0x${AIME_CONTRACT.Optimism.Powers}`,
        abi: require("@/abis/AIMePowers.json"),
        functionName: 'sellPowers',
        args: [
          `0x${character?.wallet?.optimism}`,
          powerValue,
        ],
        account: address as `0x${string}`,
        value: ethValue,
      });
      setGas(gas ?? 0n);
    })();
  }, [publicClient]);

  useEffect(() => {
    ; (async () => {
      if (isSuccess && !!data?.hash && !!accessToken) {
        setSellModalVisible(false);
        setSellSuccessVisible(true);
        setTransactionHash(data?.hash);

        await CreateTransaction({
          chain_id: NETWORK_CONFIG?.chains[0]?.id?.toString(),
          address: address,
          hash: data?.hash,
        }, accessToken);
      }

      if (!!error) {
        setSellFailedVisible(true);
        setError(error);
      }
    })();
  }, [accessToken, data, isSuccess, error]);

  useEffect(() => {
    GetTokenPrice({
      token: "ethereum",
      currency: "usd",
    }).then(({ response, data }) => {
      if (response?.status === 200) {
        setTokenPrice(data?.ethereum?.usd);
      }
    });
  }, []);

  useEffect(() => {
    if (!!switchNetworkError) {
      notification.error({
        key: "switchNetworkError",
        message: "Switch Network Error",
        description: switchNetworkError?.message,
      });
    }
  }, [switchNetworkError]);

  return (
    <div className={styles.detailModalContainer}>
      <div className={styles.detailModalHeader}>
        <div className={styles.detailModalHeaderIcon}>
          <img
            className={styles.detailModalHeaderIconImg}
            src={require("@/assets/icon/transaction.png")}
            alt="transaction"
          />
          <div className={styles.detailModalHeaderIconAvatar}>
            <Image
              className={styles.indexModalContentCharacterLeftAvatarImg}
              src={character?.avatar_url}
              fallback={require('@/assets/me/avatar.png')}
              alt="avatar"
            />
          </div>
        </div>
        <div className={styles.detailModalHeaderTitle}>
          Transaction Details
        </div>
      </div>
      <div className={styles.detailModalContent}>
        <div
          className={styles.detailModalContentTitle}
          onClick={() => setBodyDropdown(!bodyDropdown)}
        >
          <div className={styles.detailModalContentTitleLeft}>
            <div className={styles.detailModalContentTitleLeftTitle}>
              Sale Details
            </div>
          </div>
          <div className={styles.detailModalContentTitleRight}>
            <div className={styles.detailModalContentTitleRightValue}>
              ${(Number(formatEther((gas ?? 0n) + (ethValue ?? 0n))) * tokenPrice).toFixed(2)}
            </div>
            <AiFillCaretDown
              className={styles.detailModalContentTitleRightIcon}
              style={{
                transform: bodyDropdown ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
        </div>
        <div className={styles.detailModalContentLine} />
        <div
          className={styles.detailModalContentBody}
          style={{
            height: bodyDropdown ? 120 : 0,
          }}
        >
          <div className={styles.detailModalContentBodyItem}>
            <div className={styles.detailModalContentBodyItemTitle}>
              From
            </div>
            <div className={styles.detailModalContentBodyItemValue}>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
          </div>
          <div className={styles.detailModalContentBodyItem}>
            <div className={styles.detailModalContentBodyItemTitle}>
              To
            </div>
            <div className={styles.detailModalContentBodyItemValue}>
              {(`0x${character?.wallet?.optimism}`)?.slice(0, 5)}...{(`0x${character?.wallet?.optimism}`)?.slice(-4)}
            </div>
          </div>
          <div className={styles.detailModalContentBodyItem}>
            <div className={styles.detailModalContentBodyItemTitle}>
              Action
            </div>
            <div className={styles.detailModalContentBodyItemValue}>
              Buy Power
            </div>
          </div>
          <div className={styles.detailModalContentBodyItem}>
            <div className={styles.detailModalContentBodyItemTitle}>
              <b>Est. Fees</b> ({Number(formatEther(gas ?? 0n)).toFixed(2)} ETH)
            </div>
            <div className={styles.detailModalContentBodyItemValue}>
              USD <b>${(Number(formatEther(gas ?? 0n)) * tokenPrice).toFixed(2)}</b>
            </div>
          </div>
        </div>
        <div className={styles.detailModalContentTotal}>
          <div className={styles.detailModalContentTotalLeft}>
            <div className={styles.detailModalContentTotalLeftTitle}>
              Total <span>(including fees)</span>
            </div>
            <div className={styles.detailModalContentTotalLeftPrice}>
              {formatEther(ethValue ?? 0n)} ETH
            </div>
          </div>
          <div className={styles.detailModalContentTotalRight}>
            <div className={styles.detailModalContentTotalRightFlat}>
              USD <b>${(Number(formatEther((gas ?? 0n) + (ethValue ?? 0n))) * tokenPrice).toFixed(2)}</b>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.detailModalFooter}>
        <div className={styles.detailModalFooterLeft}>
          <RiWalletLine />
          <span>
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
        <div className={styles.detailModalFooterRight}>
          {Number(powerBalance)} Power
        </div>
      </div>
      {currentChain?.id !== chains[0]?.id ? (
        <Button
          block
          type="primary"
          size="large"
          className={styles.detailModalFooterButton}
          loading={switchNetworkLoading && pendingChainId === chains[0]?.id}
          onClick={() => {
            switchNetwork?.(chains[0]?.id);
          }}
        >
          <span>Change Network</span>
        </Button>
      ) : (
        <Button
          block
          type="primary"
          size="large"
          className={styles.detailModalFooterButton}
          loading={isLoading}
          disabled={parseFloat(balance?.formatted ?? "0") === 0 || parseFloat(balance?.formatted ?? "0") < parseFloat(formatEther(gas)) || powerBalance === 0n}
          onClick={async () => {
            await write({
              args: [
                `0x${character?.wallet?.optimism}`,
                powerValue,
              ],
              value: gas,
            })
          }}
        >
          {(parseFloat(balance?.formatted ?? "0") === 0 || parseFloat(balance?.formatted ?? "0") < parseFloat(formatEther(gas)) || powerBalance === 0n) ? (
            <span>Insufficient Balance</span>
          ) : (
            <span>Confirm Purchase</span>
          )}
        </Button>
      )}
    </div >
  )
};

const Sell: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  transactionHash: `0x${string}` | undefined;
  setTransactionHash: React.Dispatch<React.SetStateAction<`0x${string}` | undefined>>;
}> = ({ visible, setVisible, transactionHash, setTransactionHash }) => {
  const [powerValue, setPowerValue] = React.useState<number>(0);
  const [sellSuccessVisible, setSellSuccessVisible] = React.useState<boolean>(false);
  const [sellFailedVisible, setSellFailedVisible] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error>(new Error(""));

  useEffect(() => {
    if (!visible) {
      setPowerValue(0);
      setSellSuccessVisible(false);
      setSellFailedVisible(false);
      setError(new Error(""));
    }
  }, [visible]);

  return (
    <>
      {powerValue === 0 ? (
        <Select
          powerValue={powerValue}
          setPowerValue={setPowerValue}
        />
      ) : (
        <Detail
          powerValue={powerValue}
          setSellSuccessVisible={setSellSuccessVisible}
          setSellFailedVisible={setSellFailedVisible}
          setError={setError}
          setTransactionHash={setTransactionHash}
          setSellModalVisible={setVisible}
        />
      )}
      <PurchaseSuccess
        visible={sellSuccessVisible}
        setVisible={setSellSuccessVisible}
        transactionHash={transactionHash}
      />
      <PurchaseFailed
        visible={sellFailedVisible}
        setVisible={setSellFailedVisible}
        error={error}
      />
    </>
  )
};

export default Sell;
