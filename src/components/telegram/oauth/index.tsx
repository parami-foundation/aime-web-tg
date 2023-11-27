import React from "react";
import { useModel } from "@umijs/max";
import styles from "./style.less";
import { Button, ConfigProvider, Modal, theme } from "antd";
import TelegramLoginButton from 'react-telegram-login';
import { THEME_CONFIG } from "@/constants/theme";
import { TELEGRAM_BOT } from "@/constants/global";
import { ReactComponent as TelegramIcon } from "@/assets/brand/telegram.svg";
import { FaAngleRight } from "react-icons/fa";

export interface TelegramOauthDataOnauthProps {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: number;
  hash?: string;
};

const TelegramOauth: React.FC<{
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  closeable?: boolean;
}> = ({ visible, setVisible, closeable }) => {
  const { telegramDataString, setTelegramData, setTelegramDataString, setTelegramAuthType } = useModel('useTelegram');

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
          Log in with Telegram
        </div>
        <div className={styles.loginModalContent}>
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
              className={styles.loginModalContentItem}
            >
              <TelegramLoginButton
                dataOnauth={(response: TelegramOauthDataOnauthProps) => {
                  setTelegramData(response);
                  setTelegramAuthType('oauth2');
                  let initDataString = "";
                  for (let key in response) {
                    if (initDataString != "") {
                      initDataString += "&";
                    }
                    initDataString +=
                      key + "=" + encodeURIComponent((response as any)[key]);
                  }
                  setTelegramDataString(initDataString);
                }}
                botName={TELEGRAM_BOT}
                className={styles.telegramLoginBtn}
              />
              <div className={styles.loginModalContentItemLeft}>
                <TelegramIcon
                  className={styles.loginModalContentItemIcon}
                />
                <div className={styles.loginModalContentItemText}>
                  Telegram
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

export default TelegramOauth;
