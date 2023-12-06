import React from "react";
import styles from "./style.less";
import { ReactComponent as ChatIcon } from '@/assets/icon/chat.svg';
import { ReactComponent as FirstIcon } from '@/assets/icon/1st.svg';
import { FaEthereum } from "react-icons/fa";
import { Tag, Image } from "antd";
import { THEME_CONFIG } from "@/constants/theme";
import { Character } from "@/types";

const CardItem: React.FC<{
  character: Character;
  onClick: () => void;
}> = ({ character, onClick }) => {
  const avatar = new Blob([character?.avatar_url || require('@/assets/me/avatar.png')], { type: 'image/png' });

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
            <span>{character?.chat_count}</span>
          </div>
        </div>
        <div className={styles.cardItemAvatarContainer}>
          <div className={styles.cardItemAvatar}>
            <Image
              className={styles.cardItemAvatarImg}
              src={character?.avatar_url}
              fallback={require('@/assets/me/avatar.png')}
              preview={false}
            />
          </div>
          <div className={styles.cardItemAvatarTokenCount}>
            <FaEthereum
              className={styles.cardItemAvatarTokenCountIcon}
            />
            <span>{character?.value?.toFixed(2)}</span>
          </div>
        </div>
        <div className={styles.cardItemName}>
          {character?.name}
        </div>
        <div className={styles.cardItemDescription}>
          {character?.description}
        </div>
        <div className={styles.cardItemTags}>
          {character?.tags?.map((tag, index) => (
            <Tag
              key={index}
              color={THEME_CONFIG.colorSecondary}
              className={styles.cardItemTag}
            >
              #{tag}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  )
};

export default CardItem;
