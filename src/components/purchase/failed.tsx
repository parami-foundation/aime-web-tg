import React from "react";
import styles from "./style.less";
import { Button, Modal } from "antd";

const PurchaseFailed: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  error: Error;
  mode: "purchase" | "sale";
}> = ({ visible, setVisible, error, mode }) => {
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
          {mode === "purchase" && (
            <div className={styles.purchaseHeaderIconFailed}>
              <img
                className={styles.purchaseHeaderIconImg}
                src={require("@/assets/icon/purchase_failed.png")}
                alt="icon"
              />
            </div>
          )}
          {mode === "sale" && (
            <div className={styles.purchaseHeaderIconSale}>
              <img
                className={styles.purchaseHeaderIconImg}
                src={require("@/assets/icon/sale_failed.png")}
                alt="icon"
              />
            </div>
          )}
          <div className={styles.purchaseHeaderTitle}>
            {mode === "purchase" && "Purchase Failed"}
            {mode === "sale" && "Sale Failed"}
          </div>
        </div>
        <div className={styles.purchaseContent}>
          {error.message}
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

export default PurchaseFailed;
