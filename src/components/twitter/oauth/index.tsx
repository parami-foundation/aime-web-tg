import React from "react";
import styles from "./style.less";
import { Button, ConfigProvider, Modal, message, theme } from "antd";
import { THEME_CONFIG } from "@/constants/theme";
import { FaAngleRight } from "react-icons/fa";
import { ReactComponent as TwitterIcon } from "@/assets/brand/twitter.svg";
import { useModel } from "@umijs/max";

const TwitterOauth: React.FC<{
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  closeable?: boolean;
}> = ({ visible, setVisible, closeable }) => {
  const { telegramDataString, miniAppUtils, telegramWebApp } = useModel("useTelegram");
  const { twitterLoginMethod } = useModel("useTwitter");

  return (
    <Modal
      centered
      title={null}
      footer={null}
      className={styles.loginModal}
      open={visible}
      onCancel={() => setVisible(false)}
      closable={closeable ?? false}
      maskClosable={closeable ?? false}
    >
      <div className={styles.loginModalContainer}>
        <div className={styles.loginModalHeader}>
          <div className={styles.loginModalHeaderIcon}>
            <img
              className={styles.loginModalHeaderIconImg}
              src={require("@/assets/me/avatar.png")}
              alt="icon"
            />
          </div>
          <div className={styles.loginModalHeaderTitle}>
            Bind Twitter
          </div>
        </div>
        <div className={styles.loginModalContent}>
          <ConfigProvider
            theme={{
              algorithm: theme.defaultAlgorithm,
              token: {
                wireframe: false,
                colorPrimary: THEME_CONFIG.colorGray,
                borderRadius: THEME_CONFIG.borderRadius,
                boxShadow: THEME_CONFIG.boxShadow,
              },
            }}
          >
            <Button
              block
              type="primary"
              size="large"
              className={styles.loginModalContentItem}
              onClick={() => {
                if (!!twitterLoginMethod?.url) {
                  (!!telegramDataString && !!telegramWebApp) ? miniAppUtils?.openLink(twitterLoginMethod?.url) : window.open(twitterLoginMethod?.url, "_blank");
                  (!!telegramDataString && !!telegramWebApp) && telegramWebApp?.close();
                } else {
                  message.error("Twitter login method not found");
                }
              }}
            >
              <div className={styles.loginModalContentItemLeft}>
                <TwitterIcon
                  className={styles.loginModalContentItemIcon}
                />
                <div className={styles.loginModalContentItemText}>
                  Twitter
                </div>
              </div>
              <div className={styles.loginModalContentItemRight}>
                <FaAngleRight
                  className={styles.loginModalContentItemRightIcon}
                />
              </div>
            </Button>
          </ConfigProvider>
        </div>
      </div>
    </Modal>
  );
};

export default TwitterOauth;
