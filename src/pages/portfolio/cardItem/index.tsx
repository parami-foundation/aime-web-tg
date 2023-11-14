import React from "react";
import styles from "./style.less";
import { VscVerifiedFilled } from "react-icons/vsc";
import { FaXTwitter } from "react-icons/fa6";

const CardItem: React.FC = () => {
  return (
    <div className={styles.cardItemContainer}>
      <div className={styles.cardItemWrapper}>
        <div className={styles.cardItemContent}>
          <div className={styles.cardItemContentAvatar}>
            <img
              src="https://media.licdn.com/dms/image/C5103AQEjthnHx0FTLQ/profile-displayphoto-shrink_800_800/0/1536214237739?e=2147483647&v=beta&t=Th9UXbvF5Rc9oF6E-C4HFotvCZQbDj-AH5BVN2wtWbw"
              alt="avatar"
            />
          </div>
          <div className={styles.cardItemContentText}>
            <div className={styles.cardItemContentTextName}>
              <span>justinsuntron</span>
              <VscVerifiedFilled
                className={styles.cardItemContentTextNameVerified}
              />
            </div>
            <div className={styles.cardItemContentTextX}>
              <span>@elonmusk</span>
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
