import React from "react";
import styles from "./style.less";
import { Button, ConfigProvider, InputNumber, Modal, theme } from "antd";
import { AiFillCaretDown, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { RiWalletLine } from "react-icons/ri";
import { THEME_CONFIG } from "@/constants/theme";
import PurchaseSuccess from "@/components/purchase/success";
import PurchaseFailed from "@/components/purchase/failed";

const Select: React.FC<{
  powerValue: number;
  setPowerValue: (powerValue: number) => void;
}> = ({ powerValue, setPowerValue }) => {
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
          1 Power ≈ 0.02481875 ETH
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
            0.03 ETH
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
            0.24 ETH
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
            0.5 ETH
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
            (1.5 ETH available)
          </div>
        </div>
        <div className={styles.selectModalContentItemFullRight}>
          <div className={styles.selectModalContentItemFullPrice}>
            100 Power
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
  setPurchaseSuccessVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setPurchaseFailedVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setPurchaseSuccessVisible, setPurchaseFailedVisible }) => {
  const [bodyDropdown, setBodyDropdown] = React.useState<boolean>(false);

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
              0x208...439C
            </div>
          </div>
          <div className={styles.detailModalContentBodyItem}>
            <div className={styles.detailModalContentBodyItemTitle}>
              To
            </div>
            <div className={styles.detailModalContentBodyItemValue}>
              0xCF2...A4d4
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
              0.024819 ETH
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
          <span>0x208...439C</span>
        </div>
        <div className={styles.detailModalFooterRight}>
          0.450139 ETH available
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
          onClick={() => {
            setPurchaseSuccessVisible(true);
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
            setPurchaseSuccessVisible={setPurchaseSuccessVisible}
            setPurchaseFailedVisible={setPurchaseFailedVisible}
          />
        )}
      </Modal>
      <PurchaseSuccess
        visible={purchaseSuccessVisible}
        setVisible={setPurchaseSuccessVisible}
      />
      <PurchaseFailed
        visible={purchaseFailedVisible}
        setVisible={setPurchaseFailedVisible}
      />
    </>
  )
};

export default BuyModal;
