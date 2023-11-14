import React from "react";
import styles from "./style.less";
import { ReactComponent as ChatIcon } from '@/assets/icon/chat.svg';
import { ReactComponent as FirstIcon } from '@/assets/icon/1st.svg';
import { FaEthereum } from "react-icons/fa";
import { Tag } from "antd";
import { THEME_CONFIG } from "@/constants/theme";

const CardItem: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  return (
    <div
      className={styles.cardItemContainer}
      onClick={onClick}
    >
      <div className={styles.cardItemWrapper}>
        <div className={styles.cardItemBadges}>
          <div className={styles.cardItemBadge}>
            <FirstIcon
              className={styles.cardItemBadgeIcon}
            />
          </div>
          <div className={styles.cardItemChatCount}>
            <ChatIcon
              className={styles.cardItemChatCountIcon}
            />
            <span>2978</span>
          </div>
        </div>
        <div className={styles.cardItemAvatarContainer}>
          <img
            className={styles.cardItemAvatar}
            src="https://media.licdn.com/dms/image/C5103AQEjthnHx0FTLQ/profile-displayphoto-shrink_800_800/0/1536214237739?e=2147483647&v=beta&t=Th9UXbvF5Rc9oF6E-C4HFotvCZQbDj-AH5BVN2wtWbw"
            alt="avatar"
          />
          <div className={styles.cardItemAvatarTokenCount}>
            <FaEthereum
              className={styles.cardItemAvatarTokenCountIcon}
            />
            <span>899.00</span>
          </div>
        </div>
        <div className={styles.cardItemName}>
          justinsuntron
        </div>
        <div className={styles.cardItemDescription}>
          You’re wasting my time. I literally rule the world.
        </div>
        <div className={styles.cardItemTags}>
          <Tag
            color={THEME_CONFIG.colorSecondary}
            className={styles.cardItemTag}
          >
            #Business
          </Tag>
          <Tag
            color={THEME_CONFIG.colorSecondary}
            className={styles.cardItemTag}
          >
            #Tech
          </Tag>
        </div>
      </div>
    </div>
  )
};

export default CardItem;
