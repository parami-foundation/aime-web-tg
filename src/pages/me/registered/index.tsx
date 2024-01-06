import React from 'react';
import styles from './style.less';
import { ReactComponent as AvatarCircle } from '@/assets/me/circle.svg';
import { FaEthereum } from 'react-icons/fa';
import { Image } from 'antd';
import { useModel } from '@umijs/max';
import { InitData } from '@tma.js/sdk';
import { TelegramOauthDataOnauthProps } from '@/types';

const AvatarRegistered: React.FC = () => {
  const { profile } = useModel('useAccess');
  const { telegramData } = useModel("useTelegram");

  return (
    <div className={styles.meAvatar}>
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
            src={profile?.telegram?.avatar_uri || (telegramData as InitData)?.user?.photoUrl || (telegramData as TelegramOauthDataOnauthProps)?.photo_url}
            fallback={require('@/assets/me/avatar.png')}
            preview={false}
          />
        </div>
        <div className={styles.meAvatarToken}>
          <FaEthereum
            className={styles.meAvatarTokenIcon}
          />
          <span>3.655</span>
        </div>
      </div>
      <div className={styles.meAvatarPop}>
        <div className={styles.meAvatarPopWrapper}>
          👋 Hi, {profile?.telegram?.name || (telegramData as InitData)?.user?.firstName || (telegramData as TelegramOauthDataOnauthProps)?.first_name}
        </div>
      </div>
    </div>
  )
};

export default AvatarRegistered;
