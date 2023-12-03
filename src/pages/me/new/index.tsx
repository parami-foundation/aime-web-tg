import React from "react";
import styles from "./style.less";
import { FaEthereum } from "react-icons/fa";
import { ReactComponent as AvatarCircle } from '@/assets/me/circle.svg';
import { IoIosLock } from "react-icons/io";

const AvatarNew: React.FC = () => {
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