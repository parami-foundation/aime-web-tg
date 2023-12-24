import React from "react";
import styles from "./style.less";
import { ReactComponent as AvatarCircle } from '@/assets/me/circle.svg';
import { IoIosLock } from "react-icons/io";
import { Image } from "antd";
import { useModel, history } from "@umijs/max";
import { InitData } from "@tma.js/sdk";
import { TelegramOauthDataOnauthProps } from "@/types";

const AvatarNew: React.FC = () => {
  const { profile } = useModel("useAccess");
  const { telegramData } = useModel("useTelegram");

  return (
    <div
      className={styles.meAvatar}
      onClick={() => {
        history.push('/create');
      }}
    >
      <div className={styles.meAvatarWrapper}>
        <AvatarCircle
          className={styles.meAvatarCircle}
        />
        <div className={styles.meAvatarCirclePoint}>
          <div className={styles.meAvatarCirclePointWrapper} />
        </div>
        <div className={styles.meAvatarImage}>
          <Image
            className={styles.meAvatarImageSrc}
            src={profile?.avatar_uri || (telegramData as InitData)?.user?.photoUrl || (telegramData as TelegramOauthDataOnauthProps)?.photo_url}
            fallback={require('@/assets/me/avatar.png')}
            preview={false}
          />
        </div>
        <IoIosLock
          className={styles.meAvatarLock}
        />
      </div>
      <div className={styles.meAvatarPop}>
        <div className={styles.meAvatarPopWrapper}>
          <div className={styles.meAvatarPopWrapperTitle}>
            How to create own AIME? 🤔
          </div>
          <div className={styles.meAvatarPopWrapperContent}>
            Create AIME it is necessary to accumulate a certain <b>amount of followers and activity.</b>
          </div>
        </div>
      </div>
    </div>
  )
};

export default AvatarNew;