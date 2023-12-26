import React from 'react';
import styles from './style.less';
import { Button, Modal } from 'antd';
import { history } from "@umijs/max";

const Success: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
}> = ({ visible, setVisible }) => {
  return (
    <Modal
      centered
      title={null}
      footer={null}
      className={styles.successModal}
      open={visible}
      onCancel={() => setVisible(false)}
      closeIcon={null}
    >
      <div className={styles.successContainer}>
        <div className={styles.successHeader}>
          <div className={styles.successHeaderIconSuccess}>
            <img
              className={styles.successHeaderIconImg}
              src={require('@/assets/create/success.png')}
              alt="icon"
            />
          </div>
          <div className={styles.successHeaderTitle}>
            Congratulations
          </div>
        </div>
        <div className={styles.successContent}>
          You have successfully created your AIME.
        </div>
        <div className={styles.successFooter}>
          <Button
            block
            type="primary"
            className={styles.successFooterBtn}
            size="large"
            onClick={() => {
              setVisible(false);
              history.push('/me');
            }}
          >
            OK
          </Button>
        </div>
      </div>
    </Modal>
  )
};

export default Success;
