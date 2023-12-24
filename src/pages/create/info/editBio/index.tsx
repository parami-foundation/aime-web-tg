import React from "react";
import styles from "./style.less";
import { Button, Input, Modal } from "antd";

const { TextArea } = Input;

const EditBio: React.FC<{
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  bio: string | null;
  setBio: React.Dispatch<React.SetStateAction<string | null>>;
  closeable?: boolean;
}> = ({ visible, setVisible, bio, setBio, closeable }) => {
  return (
    <Modal
      centered
      title={null}
      footer={null}
      className={styles.editBioModal}
      open={visible}
      onCancel={() => setVisible(false)}
      closable={closeable ?? false}
      maskClosable={closeable ?? false}
    >
      <div className={styles.editBioContainer}>
        <div className={styles.editBioHeader}>
          <div className={styles.editBioHeaderIcon}>
            <img
              className={styles.editBioHeaderIconImg}
              src={require("@/assets/icon/edit.png")}
              alt="icon"
            />
          </div>
          <div className={styles.editBioHeaderTitle}>
            Edit Bio
          </div>
        </div>
        <div className={styles.editBioContent}>
          <TextArea
            bordered={false}
            className={styles.editBioContentInput}
            showCount
            rows={6}
            maxLength={300}
            value={bio || undefined}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div className={styles.editBioFooter}>
          <Button
            className={styles.editBioFooterButton}
            type="primary"
            shape="round"
            size="large"
            block
            onClick={() => setVisible(false)}
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditBio;
