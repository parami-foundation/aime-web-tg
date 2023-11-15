import React from "react";
import styles from "./style.less";
import { Button, Modal } from "antd";

const Pending: React.FC = () => {
  return (
    <div className={styles.airdropContainer}>
      <div className={styles.airdropHeader}>
        <div className={styles.airdropHeaderPendingIcon}>
          <img
            className={styles.airdropHeaderPendingIconImg}
            src={require("@/assets/me/airdrop.png")}
          />
        </div>
        <div className={styles.airdropHeaderTitle}>
          Airdrop
        </div>
      </div>
      <div className={styles.airdropContent}>
        Points are airdropped every Friday and will have future uses in AIME.
      </div>
    </div>
  )
};

const AirDrop: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
}> = ({ visible, setVisible }) => {
  return (
    <Modal
      centered
      title={null}
      footer={null}
      className={styles.airdropModal}
      open={visible}
      onCancel={() => setVisible(false)}
      closeIcon={null}
    >
      <Pending />
      <div className={styles.airdropFooter}>
        <Button
          block
          type="primary"
          className={styles.airdroFooterBtn}
          size="large"
          onClick={() => setVisible(false)}
        >
          OK
        </Button>
      </div>
    </Modal>
  )
};

export default AirDrop;
