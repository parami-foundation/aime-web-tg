import React from "react";
import styles from "./style.less";
import { AccessLayout } from "@/layouts/access";
import classNames from "classnames";
import CardItem from "./cardItem";
import { Col, Row } from "antd";
import NavBar from "@/components/navBar";
import { history } from "@umijs/max";
import { charactersData } from "@/mocks/character";

const Home: React.FC = () => {
  const [tab, setTab] = React.useState<string>("trend");

  return (
    <AccessLayout>
      <div className={styles.homeContainer}>
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
              {Array.from(charactersData).map((character, index) => {
                const [id, data] = character;
                return (
                  <Col
                    xs={12} sm={12} md={8} lg={6} xl={4}
                    key={id}
                  >
                    <CardItem
                      key={id}
                      character={data}
                      onClick={() => {
                        history.push(`/chat/${id}`);
                      }}
                    />
                  </Col>
                )
              })}
            </Row>
          </div>
        </div>
        <NavBar />
      </div>
    </AccessLayout>
  );
};

export default Home;
