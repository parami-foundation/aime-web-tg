import React from "react";
import styles from "./style.less";
import { Button, Modal } from "antd";

const PurchaseSuccess: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
}> = ({ visible, setVisible }) => {
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
            />
          </div>
          <div className={styles.purchaseHeaderTitle}>
            Purchase Success
          </div>
        </div>
        <div className={styles.purchaseContent}>
          Successfully purchased justinsuntron’s 1 power for 0.03 ETH.
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
