import React from "react";
import styles from "./style.less";

const CardItem: React.FC = () => {
  return (
    <div className={styles.cardItemContainer}>
      <div className={styles.cardItemWrapper}>
        <div className={styles.cardItemHeader}>
          <div className={styles.cardItemHeaderDate}>
            <span>19:35 Oct 24</span>
          </div>
        </div>
        <div className={styles.cardItemContent}>
          <div className={styles.cardItemContentAvatar}>
            <img
              src="https://media.licdn.com/dms/image/C5103AQEjthnHx0FTLQ/profile-displayphoto-shrink_800_800/0/1536214237739?e=2147483647&v=beta&t=Th9UXbvF5Rc9oF6E-C4HFotvCZQbDj-AH5BVN2wtWbw"
              alt="avatar"
            />
          </div>
          <div className={styles.cardItemContentText}>
          </div>
        </div>
      </div>
    </div>
  )
};

export default CardItem;
