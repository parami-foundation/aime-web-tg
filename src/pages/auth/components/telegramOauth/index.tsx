import React from "react";
import styles from './style.less';
import TelegramLoginButton from 'react-telegram-login';
import { TELEGRAM_BOT } from "@/constants/global";
import { FaTelegramPlane } from 'react-icons/fa';

export interface TelegramOauthDataOnauthProps {
  id?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: string;
  hash?: string;
};

export interface TelegramOauthProps {
  dataOnauth: (response: TelegramOauthDataOnauthProps) => void;
};

const TelegramOauth: React.FC<TelegramOauthProps> = ({
  dataOnauth
}) => {
  return (
    <div className={styles.telegramButton}>
      <TelegramLoginButton
        dataOnauth={dataOnauth}
        botName={TELEGRAM_BOT}
        className={styles.telegramLoginBtn}
      />
      <div className={styles.loginButton}>
        <FaTelegramPlane
          className={styles.loginIcon}
        />
        Login with Telegram
      </div>
    </div>
  )
};

export default TelegramOauth;
