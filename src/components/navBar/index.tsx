import React, { useEffect } from "react";
import styles from "./style.less";
import { ReactComponent as HomeIcon } from '@/assets/icon/navbar/home.svg';
import { ReactComponent as PortfolioIcon } from '@/assets/icon/navbar/portfolio.svg';
import { ReactComponent as ChatIcon } from '@/assets/icon/navbar/chat.svg';
import { ReactComponent as MeIcon } from '@/assets/icon/navbar/me.svg';
import { useLocation, history } from "@umijs/max";
import classNames from "classnames";

const NavBar: React.FC = () => {
  const [menu, setMenu] = React.useState<string>('');

  const location = useLocation();

  useEffect(() => {
    const key = location.pathname.split('/')[1];
    setMenu(key);
  }, [location]);

  return (
    <div className={styles.navBarContainer}>
      <div className={styles.navBarWrapper}>
        <div
          className={classNames(styles.navBarItem, menu === 'home' && styles.navBarIconActive)}
          onClick={() => {
            history.push('/');
          }}
        >
          <HomeIcon
            className={styles.navBarIcon}
          />
          <div className={styles.navBarText}>
            Home
          </div>
        </div>
        <div
          className={classNames(styles.navBarItem, menu === 'portfolio' && styles.navBarIconActive)}
          onClick={() => {
            history.push('/portfolio');
          }}
        >
          <PortfolioIcon
            className={styles.navBarIcon}
          />
          <div className={styles.navBarText}>
            Portfolio
          </div>
        </div>
        <div
          className={classNames(styles.navBarItem, menu === 'chat' && styles.navBarIconActive)}
          onClick={() => {
            history.push('/chat');
          }}
        >
          <ChatIcon
            className={styles.navBarIcon}
          />
          <div className={styles.navBarText}>
            Chat
          </div>
        </div>
        <div
          className={classNames(styles.navBarItem, menu === 'me' && styles.navBarIconActive)}
          onClick={() => {
            history.push('/me');
          }}
        >
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
