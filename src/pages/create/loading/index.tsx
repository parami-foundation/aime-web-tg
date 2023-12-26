import React from "react";
import styles from "./style.less";
import { Modal } from "antd";
import { Image } from "antd";

const Loading: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
}> = ({ visible, setVisible }) => {
  return (
    <Modal
      centered
      title={null}
      footer={null}
      className={styles.loadingModal}
      open={visible}
      onCancel={() => setVisible(false)}
      closeIcon={null}
      width={300}
    >
      <div className={styles.loadingContainer}>
        <div className={styles.loadingImageContainer}>
          <Image
            className={styles.loadingImage}
            src={require('@/assets/create/loading.png')}
            fallback={require('@/assets/me/avatar.png')}
            preview={false}
          />
        </div>
      </div>
    </Modal>
  )
};

export default Loading;
