import React from "react";
import styles from "../style.less";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loading: React.FC = () => {
  return (
    <>
      <div className={styles.loginModalHeader}>
        Loging in...
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
