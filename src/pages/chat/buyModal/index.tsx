import React from "react";
import styles from "./style.less";
import { Modal } from "antd";
import classNames from "classnames";

const Select: React.FC = () => {
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
          Buy Power
        </div>
        <div className={styles.selectModalHeaderSubtitle}>
          Buy <b>1 Power</b> for <b>0.02481875 ETH</b>
        </div>
      </div>
      <div className={styles.selectModalContent}>
        <div className={styles.selectModalContentItem}>
          <div className={styles.selectModalContentItemPrice}>
            0.03 ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            1 Power
          </div>
        </div>
        <div className={styles.selectModalContentItem}>
          <div className={styles.selectModalContentItemPrice}>
            0.24 ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            10 Power
          </div>
        </div>
        <div className={styles.selectModalContentItem}>
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
            All in <span>(1.5 ETH available)</span>
          </div>
          <div className={styles.selectModalContentItemPower}>
            30 Power
          </div>
        </div>
        <div className={styles.selectModalContentItemFullRight}>
          <div className={styles.selectModalContentItemFullControl}>
            <div className={styles.selectModalContentItemFullControlMinus}>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

const BuyModal: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
}> = ({ visible, setVisible }) => {
  return (
    <Modal
      centered
      title={null}
      footer={null}
      className={styles.selectModal}
      open={visible}
      onCancel={() => setVisible(false)}
    >
      <Select />
    </Modal>
  )
};

export default BuyModal;
