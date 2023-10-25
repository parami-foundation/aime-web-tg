import React from "react";
import styles from "./style.less";
import { Modal, Tag } from "antd";
import { ReactComponent as MetamaskIcon } from "@/assets/brand/metamask.svg";
import { ReactComponent as TonIcon } from "@/assets/brand/ton.svg";
import { ReactComponent as WalletConnectIcon } from "@/assets/brand/walletconnect.svg";
import { FaAngleRight } from "react-icons/fa";
import { THEME_CONFIG } from "@/constants/theme";

const LoginModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  return (
    <Modal
      centered
      title={null}
      footer={null}
      className={styles.loginModal}
      open={visible}
      onCancel={onClose}
    >
      <div className={styles.loginModalContainer}>
        <div className={styles.loginModalHeader}>
          Log in with wallet
        </div>
        <div className={styles.loginModalContent}>
          <div className={styles.loginModalContentItem}>
            <div className={styles.loginModalContentItemLeft}>
              <MetamaskIcon
                className={styles.loginModalContentItemIcon}
              />
              <div className={styles.loginModalContentItemText}>
                MetaMask
              </div>
            </div>
            <div className={styles.loginModalContentItemRight}>
              <FaAngleRight
                className={styles.loginModalContentItemRightIcon}
              />
            </div>
          </div>
          <div className={styles.loginModalContentItem}>
            <div className={styles.loginModalContentItemLeft}>
              <TonIcon
                className={styles.loginModalContentItemIcon}
              />
              <div className={styles.loginModalContentItemText}>
                Ton Wallet
                <Tag
                  color={THEME_CONFIG.colorSecondary}
                  className={styles.loginModalContentItemTag}
                >
                  HOT
                </Tag>
              </div>
            </div>
            <div className={styles.loginModalContentItemRight}>
              <FaAngleRight
                className={styles.loginModalContentItemRightIcon}
              />
            </div>
          </div>
          <div className={styles.loginModalContentItem}>
            <div className={styles.loginModalContentItemLeft}>
              <WalletConnectIcon
                className={styles.loginModalContentItemIcon}
              />
              <div className={styles.loginModalContentItemText}>
                WalletConnect
              </div>
            </div>
            <div className={styles.loginModalContentItemRight}>
              <FaAngleRight
                className={styles.loginModalContentItemRightIcon}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
};

export default LoginModal;
