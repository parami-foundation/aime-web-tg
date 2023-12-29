import React from "react";
import styles from "./style.less";
import { Modal } from "antd";
import { Image } from "antd";
import ReactPlayer from "react-player";

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
          <ReactPlayer
            className={styles.loadingImage}
            url={require('@/assets/create/loading.webm')}
            playing
            muted
            loop
            controls={false}
          />
        </div>
      </div>
    </Modal>
  )
};

export default Loading;
