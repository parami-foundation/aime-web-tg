import React from "react";
import styles from "./style.less";
import { Button, Modal } from "antd";
import { ReactComponent as RankIcon } from '@/assets/me/rank.svg';

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
      <div className={styles.airdropTable}>
        <div className={styles.airdropTableItem}>
          <div className={styles.airdropTableItemTitle}>
            Your Points:
          </div>
          <div className={styles.airdropTableItemValue}>
            2 Points
          </div>
        </div>
        <div className={styles.airdropTableItem}>
          <div className={styles.airdropTableItemTitle}>
            Weekly leaderboard:
          </div>
          <div className={styles.airdropTableItemValue}>
            #16,740
          </div>
        </div>
        <div className={styles.airdropTableItem}>
          <div className={styles.airdropTableItemTitle}>
            Your rank:
          </div>
          <div className={styles.airdropTableItemValue}>
            <RankIcon
              className={styles.airdropTableItemValueRankIcon}
            />
            BRONZE
          </div>
        </div>
      </div>
    </div>
  )
};

const Success: React.FC<{
  points?: number;
  name?: string;
}> = ({ points, name }) => {
  return (
    <div className={styles.airdropContainer}>
      <div className={styles.airdropHeader}>
        <div className={styles.airdropHeaderSuccessIcon}>
          <img
            className={styles.airdropHeaderSuccessIconImg}
            src={require("@/assets/me/airdrop_success.png")}
          />
        </div>
        <div className={styles.airdropHeaderTitle}>
          Airdrop Rewards
        </div>
      </div>
      <div className={styles.airdropContent}>
        Congratulations on receiving Elon Musk’s 1 Power reward.
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
      <Success />
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
