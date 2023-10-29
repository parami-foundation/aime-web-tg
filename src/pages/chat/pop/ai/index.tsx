import React from "react";
import styles from "./style.less";
import { BsSoundwave } from "react-icons/bs";

const AiPop: React.FC<{
  type?: string;
  data?: any;
}> = ({ type, data }) => {
  return (
    <>
      {type === "message" && (
        <div className={styles.aiPopContainer}>
          <div className={styles.aiPopWrapper}>
            {data}
          </div>
        </div>
      )}
      {type === "data" && (
        <div className={styles.aiPopContainer}>
          <div className={styles.aiPopWrapper}>
            <div className={styles.audioMsg}>
              <div className={styles.audioMsgTime}>
                3''
              </div>
              <BsSoundwave
                className={styles.audioMsgIcon}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
};

export default AiPop;
