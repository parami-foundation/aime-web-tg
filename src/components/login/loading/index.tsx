import React from "react";
import styles from "../style.less";
import { Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loading: React.FC = () => {
  return (
    <>
      <div className={styles.loginModalHeader}>
        <div className={styles.loginModalHeaderIcon}>
          <img
            className={styles.loginModalHeaderIconImg}
            src={require("@/assets/icon/wallet.png")}
            alt="icon"
          />
        </div>
        <div className={styles.loginModalHeaderTitle}>
          Loading...
        </div>
      </div>
      <div className={styles.loginModalContent}>
        <Spin
          indicator={
            <LoadingOutlined
              style={{ fontSize: 24 }}
              spin
            />
          }
        />
      </div>
    </>
  )
};

export default Loading;
