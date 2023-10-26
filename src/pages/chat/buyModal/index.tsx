import React from "react";
import styles from "./style.less";
import { Modal } from "antd";

const Select: React.FC = () => {
  return (
    <Modal
      centered
      title={null}
      footer={null}
      className={styles.selectModal}
      open={true}
      closable={false}
    >
      <div className={styles.selectModalContainer}>
        <div className={styles.selectModalHeader}>
          <div className={styles.selectModalHeaderIcon}>
            <img
              src={require("@/assets/icon/buy.png")}
              alt="buy"
            />
          </div>
        </div>
      </div>
    </Modal>
  )
};

const BuyModal: React.FC = () => {
  return (
    <div className={styles.buyModal}>
    </div>
  )
};

export default BuyModal;
