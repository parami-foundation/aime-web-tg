import React from "react";
import styles from "./style.less";
import { Button, Modal } from "antd";

const PurchaseSuccess: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  transactionHash: `0x${string}` | undefined;
}> = ({ visible, setVisible, transactionHash }) => {
  return (
    <Modal
      centered
      title={null}
      footer={null}
      className={styles.purchaseModal}
      open={visible}
      onCancel={() => setVisible(false)}
      closeIcon={null}
    >
      <div className={styles.purchaseContainer}>
        <div className={styles.purchaseHeader}>
          <div className={styles.purchaseHeaderIconSuccess}>
            <img
              className={styles.purchaseHeaderIconImg}
              src={require("@/assets/icon/success.png")}
              alt="icon"
            />
          </div>
          <div className={styles.purchaseHeaderTitle}>
            Purchase Success
          </div>
        </div>
        <div className={styles.purchaseContent}>
          Transaction: {transactionHash}
        </div>
        <div className={styles.purchaseFooter}>
          <Button
            block
            type="primary"
            className={styles.purchaseFooterBtn}
            size="large"
            onClick={() => setVisible(false)}
          >
            OK
          </Button>
        </div>
      </div>
    </Modal>
  )
};

export default PurchaseSuccess;
