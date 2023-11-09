import React from "react";
import styles from "./style.less";
import { AccessLayout } from "@/layouts/access";
import classNames from "classnames";
import CardItem from "./cardItem";
import { Col, Row } from "antd";

const Home: React.FC = () => {
  const [tab, setTab] = React.useState<string>("trend");

  return (
    <AccessLayout>
      <div className={styles.homeContainer}>
        <div className={styles.homeTitle}>
          bot
        </div>
        <div className={styles.homeWrapper}>
          <div className={styles.homeTabs}>
            <div
              className={classNames(styles.homeTab, tab === 'trend' && styles.homeTabActive)}
              onClick={() => setTab('trend')}
            >
              <span>Trend</span>
            </div>
            <div
              className={classNames(styles.homeTab, tab === 'top' && styles.homeTabActive)}
              onClick={() => setTab('top')}
            >
              <span>Top</span>
            </div>
          </div>
          <div className={styles.homeContent}>
            <Row gutter={[15, 15]}>
              <Col xs={12} sm={12} md={8} lg={6} xl={4}>
                <CardItem />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </AccessLayout>
  );
};

export default Home;
