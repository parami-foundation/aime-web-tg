import React from "react";
import styles from "./style.less";
import { VscVerifiedFilled } from "react-icons/vsc";
import { FaXTwitter } from "react-icons/fa6";
import { Image } from "antd";
import { Character } from "@/types";

const CardItem: React.FC<{
  character: Character;
  onClick: () => void;
}> = ({ character }) => {
  return (
    <div className={styles.cardItemContainer}>
      <div className={styles.cardItemWrapper}>
        <div className={styles.cardItemContent}>
          <div className={styles.cardItemContentAvatar}>
            <div className={styles.cardItemAvatar}>
              <Image
                className={styles.cardItemAvatarImg}
                src={character?.avatar_url}
                fallback={require('@/assets/me/avatar.png')}
                preview={false}
              />
            </div>
          </div>
          <div className={styles.cardItemContentText}>
            <div className={styles.cardItemContentTextName}>
              <span>{character?.name}</span>
              <VscVerifiedFilled
                className={styles.cardItemContentTextNameVerified}
              />
            </div>
            <div className={styles.cardItemContentTextX}>
              <span>@{character?.twitter?.id}</span>
              <FaXTwitter
                className={styles.cardItemContentTextXIcon}
              />
            </div>
            <div className={styles.cardItemContentTextMessage}>
              Amount
              <span>10</span>
              Value
              <span>0.046875</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default CardItem;
