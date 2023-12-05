import React from "react";
import styles from "./style.less";
import { Character } from "@/services/typing.d";
import { history } from "@umijs/max";
import { Image } from "antd";

const CardItem: React.FC<{
  character: Character;
  messageSession: string;
}> = ({ character, messageSession }) => {
  return (
    <div
      className={styles.cardItemContainer}
      onClick={() => {
        history.push(`/chat/${character?.id}?session=${messageSession}`);
      }}
    >
      <div className={styles.cardItemWrapper}>
        <div className={styles.cardItemHeader}>
          <div className={styles.cardItemHeaderDate}>
            <span>19:35 Oct 24</span>
          </div>
        </div>
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
              {character?.name}
            </div>
            <div className={styles.cardItemContentTextMessage}>
              You’re wasting my time. I literally...
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default CardItem;
