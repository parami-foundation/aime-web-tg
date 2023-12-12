import React from "react";
import { useModel } from "@umijs/max";
import styles from "./style.less";
import { Button, ConfigProvider, Modal, Spin, theme } from "antd";
import TelegramLoginButton from 'react-telegram-login';
import { THEME_CONFIG } from "@/constants/theme";
import { TELEGRAM_BOT } from "@/constants/global";
import { ReactComponent as TelegramIcon } from "@/assets/brand/telegram.svg";
import { FaAngleRight } from "react-icons/fa";
import { TelegramAuth } from "@/types/enum";
import { LoadingOutlined } from "@ant-design/icons";

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
  const { telegramWebApp, telegramCloudStorage, telegramDataString, setTelegramData, setTelegramDataString, setTelegramAuthType } = useModel('useTelegram');

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
      {(!!telegramWebApp || !!telegramDataString) && (
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
              Log in...
            </div>
          </div>
          <div className={styles.loginModalContent}>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 24 }}
                  spin
                />
              }
            />
            <Button
              block
              type="primary"
              size="large"
              className={styles.loginModalContentBtn}
              onClick={() => {
                window.location.reload();
              }}
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {!telegramWebApp && !telegramDataString && (
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
              Log in with Telegram
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
              >
                <TelegramLoginButton
                  dataOnauth={(response: TelegramOauthDataOnauthProps) => {
                    setTelegramData(response);
                    setTelegramAuthType(TelegramAuth.WEB);
                    localStorage.setItem('aime:telegramData', JSON.stringify(response));
                    telegramCloudStorage?.set('aime:telegramData', JSON.stringify(response));

                    localStorage.setItem('aime:telegramAuthType', TelegramAuth.WEB);
                    telegramCloudStorage?.set('aime:telegramAuthType', TelegramAuth.WEB);

                    let initDataString = "";
                    for (let key in response) {
                      if (initDataString != "") {
                        initDataString += "&";
                      }
                      initDataString +=
                        key + "=" + (response as any)[key];
                    }
                    setTelegramDataString(decodeURIComponent(initDataString));
                    localStorage.setItem('aime:telegramDataString', decodeURIComponent(initDataString));
                    telegramCloudStorage?.set('aime:telegramDataString', decodeURIComponent(initDataString));
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
      )}
    </Modal>
  );
};

export default TelegramOauth;
