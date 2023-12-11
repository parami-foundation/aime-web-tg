import React from "react";
import styles from "./style.less";
import { AccessLayout } from "@/layouts/access";
import { Image } from "antd";
import { useModel } from "@umijs/max";
import { InitData } from "@tma.js/sdk";
import { TelegramOauthDataOnauthProps } from "@/types";

const Create: React.FC = () => {
  const { profile } = useModel("useAccess");
  const { telegramData } = useModel("useTelegram");

  const [avatar, setAvatar] = React.useState<string | undefined>(profile?.avatar_uri || (telegramData as InitData)?.user?.photoUrl || (telegramData as TelegramOauthDataOnauthProps)?.photo_url);

  return (
    <div className={styles.createContainer}>
      <div className={styles.createWrapper}>
        <div className={styles.createSteps}>
          1 / 2
        </div>
        <div className={styles.createAvatar}>
          <div className={styles.createAvatarImage}>
            <Image
              className={styles.createAvatarImageSrc}
              src={avatar}
              fallback={require('@/assets/me/avatar.png')}
              preview={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
};

export default Create;
