import React from "react";
import styles from "./style.less";
import { Button } from "antd";
import classNames from "classnames";

const AmaList: React.FC = () => {
  return (
    <div className={styles.amaListContainer}>
      <div className={styles.amaListWrapper}>
        <div className={styles.amaListItem}>
          <div className={styles.amaListItemLeft}>
            <div className={styles.amaListItemLeftAvatar}>
              <img
                src="https://avatars.githubusercontent.com/u/10260854"
                alt="avatar"
                className={styles.amaListItemLeftAvatarImg}
              />
              <div className={styles.amaListItemLeftAvatarBadge} />
            </div>
            <div className={styles.amaListItemLeftInfo}>
              <div className={styles.amaListItemLeftInfoName}>
                Elon Musk
              </div>
              <div className={styles.amaListItemLeftInfoDate}>
                Completed Q&A: 824
              </div>
            </div>
          </div>
          <div className={styles.amaListItemRight}>
            <Button
              type="primary"
              className={styles.amaListItemRightBtn}
            >
              In Progress
            </Button>
          </div>
        </div>
        <div className={styles.amaListItem}>
          <div className={styles.amaListItemLeft}>
            <div className={styles.amaListItemLeftAvatar}>
              <img
                src="https://avatars.githubusercontent.com/u/10260854"
                alt="avatar"
                className={styles.amaListItemLeftAvatarImg}
              />
            </div>
            <div className={styles.amaListItemLeftInfo}>
              <div className={styles.amaListItemLeftInfoName}>
                Elon Musk
              </div>
              <div className={styles.amaListItemLeftInfoDate}>
                Completed Q&A: 824
              </div>
            </div>
          </div>
          <div className={styles.amaListItemRight}>
            <Button
              type="primary"
              className={classNames(styles.amaListItemRightBtn, styles.amaListItemRightBtnNotStarted)}
            >
              Not Started
            </Button>
          </div>
        </div>
        <div className={styles.amaListItem}>
          <div className={styles.amaListItemLeft}>
            <div className={styles.amaListItemLeftAvatar}>
              <img
                src="https://avatars.githubusercontent.com/u/10260854"
                alt="avatar"
                className={styles.amaListItemLeftAvatarImg}
              />
            </div>
            <div className={styles.amaListItemLeftInfo}>
              <div className={styles.amaListItemLeftInfoName}>
                Elon Musk
              </div>
              <div className={styles.amaListItemLeftInfoDate}>
                Completed Q&A: 824
              </div>
            </div>
          </div>
          <div className={styles.amaListItemRight}>
            <Button
              type="primary"
              className={classNames(styles.amaListItemRightBtn, styles.amaListItemRightBtnEnded)}
            >
              Ended
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default AmaList;
