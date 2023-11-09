import React from "react";
import styles from "./style.less";
import { ReactComponent as HomeIcon } from '@/assets/icon/navbar/home.svg';
import { ReactComponent as PortfolioIcon } from '@/assets/icon/navbar/portfolio.svg';
import { ReactComponent as ChatIcon } from '@/assets/icon/navbar/chat.svg';
import { ReactComponent as MeIcon } from '@/assets/icon/navbar/me.svg';

const NavBar: React.FC = () => {
  return (
    <div className={styles.navBarContainer}>
      <div className={styles.navBarWrapper}>
        <div className={styles.navBarItem}>
          <HomeIcon
            className={styles.navBarIcon}
          />
          <div className={styles.navBarText}>
            Home
          </div>
        </div>
        <div className={styles.navBarItem}>
          <PortfolioIcon
            className={styles.navBarIcon}
          />
          <div className={styles.navBarText}>
            Portfolio
          </div>
        </div>
        <div className={styles.navBarItem}>
          <ChatIcon
            className={styles.navBarIcon}
          />
          <div className={styles.navBarText}>
            Chat
          </div>
        </div>
        <div className={styles.navBarItem}>
          <MeIcon
            className={styles.navBarIcon}
          />
          <div className={styles.navBarText}>
            Me
          </div>
        </div>
      </div>
    </div>
  )
};

export default NavBar;
