import React from "react";
import styles from "./style.less";
import { Image } from "antd";
import { Character } from "@/types";

const ActivityItem: React.FC<{
  character?: Character,
}> = ({ character }) => {
  return (
    <div className={styles.activityItemContainer}>
      <div className={styles.activityItemWrapper}>
        <div className={styles.activityItemAvatar}>
          <div className={styles.activityItemAvatarUserContainer}>
            <div className={styles.activityItemAvatarContainer}>
              <Image
                className={styles.activityItemAvatarImg}
                src={require('@/assets/me/avatar.png')}
                fallback={require('@/assets/me/avatar.png')}
                preview={false}
              />
            </div>
          </div>
          <div className={styles.activityItemAvatarCharacterContainer}>
            <div className={styles.activityItemAvatarContainer}>
              <Image
                className={styles.activityItemAvatarImg}
                src={character?.avatar_url}
                fallback={require('@/assets/me/avatar.png')}
                preview={false}
              />
            </div>
          </div>
        </div>
        <div className={styles.activityItemContent}>
          <div className={styles.activityItemContentName}>
            <b>Judy</b> bought 1 <b>justinsuntron</b> Power
          </div>
          <div className={styles.activityItemContentDescription}>
            <span className={styles.value}>0.182 ETH</span>, <span className={styles.date}>1h ago</span>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ActivityItem;
