import React from 'react';
import styles from './style.less';
import { ReactComponent as AvatarCircle } from '@/assets/me/circle.svg';
import { FaEthereum } from 'react-icons/fa';

const AvatarRegistered: React.FC = () => {
  return (
    <div className={styles.meAvatar}>
      <div className={styles.meAvatarWrapper}>
        <AvatarCircle
          className={styles.meAvatarCircle}
        />
        <div className={styles.meAvatarCirclePoint}>
          <div className={styles.meAvatarCirclePointWrapper} />
        </div>
        <img
          className={styles.meAvatarImage}
          src="https://media.licdn.com/dms/image/C5103AQEjthnHx0FTLQ/profile-displayphoto-shrink_800_800/0/1536214237739?e=2147483647&v=beta&t=Th9UXbvF5Rc9oF6E-C4HFotvCZQbDj-AH5BVN2wtWbw"
          alt="avatar"
        />
        <div className={styles.meAvatarToken}>
          <FaEthereum
            className={styles.meAvatarTokenIcon}
          />
          <span>3.655</span>
        </div>
      </div>
      <div className={styles.meAvatarPop}>
        <div className={styles.meAvatarPopWrapper}>
          👋 Hi, Nana
        </div>
      </div>
    </div>
  )
};

export default AvatarRegistered;
