import React from "react";
import styles from "./style.less";
import { Button, ConfigProvider, Modal, theme } from "antd";
import { THEME_CONFIG } from "@/constants/theme";
import { FaAngleRight } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { ReactComponent as TelegramIcon } from "@/assets/brand/telegram.svg";
import { ReactComponent as TwitterIcon } from "@/assets/brand/twitter.svg";
import Share from "@/components/share";

const ShareModal: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
}> = ({ visible, setVisible }) => {
  const [shareModalVisible, setShareModalVisible] = React.useState(false);

  return (
    <>
      <Modal
        centered
        title={null}
        footer={null}
        className={styles.shareModal}
        open={visible}
        onCancel={() => setVisible(false)}
      >
        <div className={styles.shareModalContainer}>
          <div className={styles.shareModalHeader}>
            Share To
          </div>
          <div className={styles.shareModalContent}>
            <ConfigProvider
              theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                  wireframe: false,
                  colorPrimary: THEME_CONFIG.colorWhite,
                  borderRadius: THEME_CONFIG.borderRadius,
                  boxShadow: THEME_CONFIG.boxShadow,
                },
              }}
            >
              <Button
                block
                type="primary"
                size="large"
                className={styles.shareModalContentItem}
              >
                <div className={styles.shareModalContentItemLeft}>
                  <TelegramIcon
                    className={styles.shareModalContentItemIcon}
                  />
                  <div className={styles.shareModalContentItemText}>
                    Telegram
                  </div>
                </div>
                <div className={styles.shareModalContentItemRight}>
                  <FaAngleRight
                    className={styles.shareModalContentItemRightIcon}
                  />
                </div>
              </Button>
            </ConfigProvider>
            <ConfigProvider
              theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                  wireframe: false,
                  colorPrimary: THEME_CONFIG.colorWhite,
                  borderRadius: THEME_CONFIG.borderRadius,
                  boxShadow: THEME_CONFIG.boxShadow,
                },
              }}
            >
              <Button
                block
                type="primary"
                size="large"
                className={styles.shareModalContentItem}
              >
                <div className={styles.shareModalContentItemLeft}>
                  <TwitterIcon
                    className={styles.shareModalContentItemIcon}
                  />
                  <div className={styles.shareModalContentItemText}>
                    Twitter
                  </div>
                </div>
                <div className={styles.shareModalContentItemRight}>
                  <FaAngleRight
                    className={styles.shareModalContentItemRightIcon}
                  />
                </div>
              </Button>
            </ConfigProvider>
            <ConfigProvider
              theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                  wireframe: false,
                  colorPrimary: THEME_CONFIG.colorWhite,
                  borderRadius: THEME_CONFIG.borderRadius,
                  boxShadow: THEME_CONFIG.boxShadow,
                },
              }}
            >
              <Button
                block
                type="primary"
                size="large"
                className={styles.shareModalContentItem}
                onClick={() => setShareModalVisible(true)}
              >
                <div className={styles.shareModalContentItemLeft}>
                  <IoIosMore
                    className={styles.shareModalContentItemMoreIcon}
                  />
                  <div className={styles.shareModalContentItemText}>
                    Other Platform
                  </div>
                </div>
                <div className={styles.shareModalContentItemRight}>
                  <FaAngleRight
                    className={styles.shareModalContentItemRightIcon}
                  />
                </div>
              </Button>
            </ConfigProvider>
          </div>
        </div>
      </Modal>
      <Share
        visible={shareModalVisible}
        setVisible={setShareModalVisible}
        userId={'kai'}
      />
    </>
  )
};

export default ShareModal;
