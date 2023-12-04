import React from "react";
import styles from "./style.less";
import { AccessLayout } from "@/layouts/access";
import classNames from "classnames";
import NavBar from "@/components/navBar";
import CardItem from "./cardItem";
import { charactersData } from "@/mocks/character";

const Portfolio: React.FC = () => {
  const [tab, setTab] = React.useState<string>("holding");

  return (
    <AccessLayout>
      <div className={styles.portfolioContainer}>
        <div className={styles.portfolioWrapper}>
          <div className={styles.portfolioHeader}>
            <div className={styles.portfolioTitle}>
              Total assets
            </div>
            <div className={styles.portfolioValue}>
              3.654805 ETH
            </div>
            <div className={styles.portfolioFlat}>
              $6547.663775
            </div>
          </div>
          <div className={styles.portfolioTabs}>
            <div
              className={classNames(styles.portfolioTab, tab === 'holding' && styles.portfolioTabActive)}
              onClick={() => setTab('holding')}
            >
              <span>Holding</span>
            </div>
            <div
              className={classNames(styles.portfolioTab, tab === 'watchlist' && styles.portfolioTabActive)}
              onClick={() => setTab('watchlist')}
            >
              <span>Watchlist</span>
            </div>
          </div>
          <div className={styles.portfolioContent}>
            {Array.from(charactersData).map((character, index) => {
              const [id, data] = character;
              return (
                <CardItem
                  key={id}
                  character={data}
                  onClick={() => { }}
                />
              )
            })}
          </div>
        </div>
        <NavBar />
      </div>
    </AccessLayout>
  )
};

export default Portfolio;
