import React from "react";
import styles from "./style.less";
import { Character, Resp } from "@/types";
import { history } from "@umijs/max";
import { Image } from "antd";
import moment from "moment";

const CardItem: React.FC<{
  character: Character;
  chatSession: Resp.Session;
}> = ({ character, chatSession }) => {
  return (
    <div
      className={styles.cardItemContainer}
      onClick={() => {
        history.push(`/chat/${character?.id}?session=${chatSession?.id}`);
      }}
    >
      <div className={styles.cardItemWrapper}>
        <div className={styles.cardItemHeader}>
          <div className={styles.cardItemHeaderDate}>
            <span>{!!chatSession?.created_at && moment(chatSession?.created_at).format('YYYY-MM-DD HH:mm:ss')}</span>
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
