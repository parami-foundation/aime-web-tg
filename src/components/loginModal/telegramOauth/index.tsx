import React from "react";
import styles from '../style.less';
import TelegramLoginButton from 'react-telegram-login';
import { TELEGRAM_BOT } from "@/constants/global";
import { FaAngleRight } from 'react-icons/fa';
import { ReactComponent as TelegramIcon } from "@/assets/brand/telegram.svg";
import { Button, ConfigProvider, theme } from "antd";
import { THEME_CONFIG } from "@/constants/theme";

export interface TelegramOauthDataOnauthProps {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: number;
  hash?: string;
};

export interface TelegramOauthProps {
  dataOnauth: (response: TelegramOauthDataOnauthProps) => void;
};

const TelegramOauth: React.FC<TelegramOauthProps> = ({
  dataOnauth
}) => {
  return (
    <>
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
              dataOnauth={dataOnauth}
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
    </>
  )
};

export default TelegramOauth;
