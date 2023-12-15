import React from "react";
import styles from "./style.less";
import { Image } from "antd";

const HoldersItem: React.FC<{}> = () => {
  return (
    <div className={styles.holdersItemContainer}>
      <div className={styles.holdersItemWrapper}>
        <div className={styles.holdersItemLeft}>
          <div className={styles.holdersItemAvatar}>
            <Image
              className={styles.holdersItemAvatarImg}
              src={require('@/assets/me/avatar.png')}
              fallback={require('@/assets/me/avatar.png')}
              preview={false}
            />
          </div>
          <div className={styles.holdersItemName}>
            Judy
          </div>
        </div>
        <div className={styles.holdersItemRight}>
          <div className={styles.holdersItemValue}>
            15 Power
          </div>
        </div>
      </div>
    </div>
  )
};

export default HoldersItem;
