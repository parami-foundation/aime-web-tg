import React, { useEffect } from "react";
import styles from "./style.less";
import { Button, ConfigProvider, InputNumber, Modal, theme } from "antd";
import { AiFillCaretDown, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { RiWalletLine } from "react-icons/ri";
import { THEME_CONFIG } from "@/constants/theme";
import PurchaseSuccess from "@/components/purchase/success";
import PurchaseFailed from "@/components/purchase/failed";
import { useAccount, useBalance, useContractWrite } from "wagmi";
import { AIME_CONTRACT, DEMO_CONFIG } from "@/constants/global";
import { getBuyPrice } from "@/hooks/useGetPrice";
import { formatEther } from "viem";

const Select: React.FC<{
  powerValue: number;
  setPowerValue: (powerValue: number) => void;
}> = ({ powerValue, setPowerValue }) => {
  const [unitPrice, setUnitPrice] = React.useState<bigint>(BigInt(0));

  const { address } = useAccount();
  const { data: balance, isError: balanceError, isLoading: balanceLoading } = useBalance({
    address: address,
  });

  getBuyPrice({
    powerAddress: `0x${DEMO_CONFIG.Sun}`,
    amount: 1,
  }).then((res) => {
    if (res.price) {
      setUnitPrice(res.price)
    }
  });

  return (
    <div className={styles.selectModalContainer}>
      <div className={styles.selectModalHeader}>
        <div className={styles.selectModalHeaderIcon}>
          <img
            className={styles.selectModalHeaderIconImg}
            src={require("@/assets/icon/buy.png")}
            alt="buy"
          />
          <div className={styles.selectModalHeaderIconAvatar}>
            <img
              src="https://media.licdn.com/dms/image/C5103AQEjthnHx0FTLQ/profile-displayphoto-shrink_800_800/0/1536214237739?e=2147483647&v=beta&t=Th9UXbvF5Rc9oF6E-C4HFotvCZQbDj-AH5BVN2wtWbw"
              alt="avatar"
            />
          </div>
        </div>
        <div className={styles.selectModalHeaderTitle}>
          Buy
        </div>
        <div className={styles.selectModalHeaderSubtitle}>
          <b>justinsuntron‘s</b> Power
        </div>
        <div className={styles.selectModalHeaderFlat}>
          1 Power ≈ {formatEther(unitPrice ?? 0n)} ETH
        </div>
      </div>
      <div className={styles.selectModalContent}>
        <div
          className={styles.selectModalContentItem}
          onClick={() => {
            setPowerValue!(1);
          }}
        >
          <div className={styles.selectModalContentItemPrice}>
            {formatEther(unitPrice ?? 0n)} ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            1 Power
          </div>
        </div>
        <div
          className={styles.selectModalContentItem}
          onClick={() => {
            setPowerValue!(10);
          }}
        >
          <div className={styles.selectModalContentItemPrice}>
            {formatEther(unitPrice * 10n ?? 0n)} ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            10 Power
          </div>
        </div>
        <div
          className={styles.selectModalContentItem}
          onClick={() => {
            setPowerValue!(30);
          }}
        >
          <div className={styles.selectModalContentItemPrice}>
            {formatEther(unitPrice * 30n ?? 0n)} ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            30 Power
          </div>
        </div>
      </div>
      <div className={styles.selectModalContentItemFull}>
        <div className={styles.selectModalContentItemFullLeft}>
          <div className={styles.selectModalContentItemPrice}>
            All in
          </div>
          <div className={styles.selectModalContentItemPower}>
            ({balanceError && balanceLoading ? (
              <span>0.00 ETH available</span>
            ) : (
              <span>{balance?.formatted} {balance?.symbol} available</span>
            )})
          </div>
        </div>
        <div className={styles.selectModalContentItemFullRight}>
          <div className={styles.selectModalContentItemFullPrice}>
            {!!balance?.value ? (
              <span>
                {(balance?.value / unitPrice).toString()} Power
              </span>
            ) : (
              <span>Influence Balance</span>
            )}
          </div>
          <div className={styles.selectModalContentItemFullControl}>
            <div
              className={styles.selectModalContentItemFullControlMinus}
              onClick={() => {
                if (powerValue > 0) {
                  setPowerValue(powerValue - 1);
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
                value={powerValue}
                type="number"
                onChange={(e) => {
                  setPowerValue(e!);
                }}
              />
            </div>
            <div
              className={styles.selectModalContentItemFullControlPlus}
              onClick={() => {
                if (powerValue < 100) {
                  setPowerValue(powerValue + 1);
                }
              }}
            >
              <AiOutlinePlus />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

const Detail: React.FC<{
  powerValue: number;
  setPurchaseSuccessVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setPurchaseFailedVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<Error>>;
  setTransactionHash: React.Dispatch<React.SetStateAction<string>>;
}> = ({ powerValue, setPurchaseSuccessVisible, setPurchaseFailedVisible, setError, setTransactionHash }) => {
  const [bodyDropdown, setBodyDropdown] = React.useState<boolean>(false);
  const [totalPrice, setTotalPrice] = React.useState<bigint>(BigInt(0));

  const { address } = useAccount();
  const { data: balance, isError: balanceError, isLoading: balanceLoading } = useBalance({
    address: address,
  });

  getBuyPrice({
    powerAddress: `0x${DEMO_CONFIG.Sun}`,
    amount: powerValue,
  }).then((res) => {
    if (res.price) {
      setTotalPrice(res.price)
    }
  });

  const { data, isLoading, isSuccess, error, write } = useContractWrite({
    address: `0x${AIME_CONTRACT.Powers}`,
    abi: require("@/abis/AIMePowersV3.json"),
    functionName: 'buyPowers',
  });

  useEffect(() => {
    if (isSuccess) {
      setPurchaseSuccessVisible(true);
      setTransactionHash(JSON.stringify(data));
    }
    if (!!error) {
      setPurchaseFailedVisible(true);
      setError(error);
    }
  }, [data, isLoading, isSuccess, error]);

  return (
    <div className={styles.detailModalContainer}>
      <div className={styles.detailModalHeader}>
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
              Purchase Details
            </div>
          </div>
          <div className={styles.detailModalContentTitleRight}>
            <div className={styles.detailModalContentTitleRightValue}>
              $45.49
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
              0x{DEMO_CONFIG.Sun?.slice(0, 5)}...{DEMO_CONFIG.Sun?.slice(-4)}
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
              <b>Est. Fees</b> (0 ETH)
            </div>
            <div className={styles.detailModalContentBodyItemValue}>
              USD <b>$0.01</b>
            </div>
          </div>
        </div>
        <div className={styles.detailModalContentTotal}>
          <div className={styles.detailModalContentTotalLeft}>
            <div className={styles.detailModalContentTotalLeftTitle}>
              Total <span>(including fees)</span>
            </div>
            <div className={styles.detailModalContentTotalLeftPrice}>
              {formatEther(totalPrice).toString()} ETH
            </div>
          </div>
          <div className={styles.detailModalContentTotalRight}>
            <div className={styles.detailModalContentTotalRightFlat}>
              USD <b>$45.49</b>
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
          {balanceLoading ?? balanceError ? (
            <span>0.00 ETH</span>
          ) : (
            <span>{balance?.formatted} {balance?.symbol}</span>
          )}
        </div>
      </div>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            wireframe: false,
            colorPrimary: THEME_CONFIG.colorSecondary,
            borderRadius: THEME_CONFIG.borderRadius,
            boxShadow: THEME_CONFIG.boxShadow,
          },
        }}
      >
        <Button
          block
          type="primary"
          size="large"
          className={styles.detailModalFooterButton}
          loading={isLoading}
          onClick={async () => {
            await write({
              args: [
                totalPrice,
                `0x${DEMO_CONFIG.Sun}`,
                powerValue,
              ],
            })
          }}
        >
          Complete Purchase
        </Button>
      </ConfigProvider>
    </div>
  )
};

const BuyModal: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
}> = ({ visible, setVisible }) => {
  const [powerValue, setPowerValue] = React.useState<number>(0);
  const [purchaseSuccessVisible, setPurchaseSuccessVisible] = React.useState<boolean>(false);
  const [purchaseFailedVisible, setPurchaseFailedVisible] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error>(new Error(""));
  const [transactionHash, setTransactionHash] = React.useState<string>("");

  return (
    <>
      <Modal
        centered
        title={null}
        footer={null}
        className={styles.buyModal}
        open={visible}
        onCancel={() => setVisible(false)}
      >
        {powerValue === 0 ? (
          <Select
            powerValue={powerValue}
            setPowerValue={setPowerValue}
          />
        ) : (
          <Detail
            powerValue={powerValue}
            setPurchaseSuccessVisible={setPurchaseSuccessVisible}
            setPurchaseFailedVisible={setPurchaseFailedVisible}
            setError={setError}
            setTransactionHash={setTransactionHash}
          />
        )}
      </Modal>
      <PurchaseSuccess
        visible={purchaseSuccessVisible}
        setVisible={setPurchaseSuccessVisible}
        transactionHash={transactionHash}
      />
      <PurchaseFailed
        visible={purchaseFailedVisible}
        setVisible={setPurchaseFailedVisible}
        error={error}
      />
    </>
  )
};

export default BuyModal;
