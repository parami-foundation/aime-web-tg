import React from "react";
import styles from "./style.less";
import { BsSoundwave } from "react-icons/bs";

const MePop: React.FC<{
  type?: string;
  data?: any;
}> = ({ type, data }) => {
  return (
    <>
      {type === "message" && (
        <div className={styles.mePopContainer}>
          <div className={styles.mePopWrapper}>
            {data}
          </div>
        </div>
      )}
      {type === "data" && (
        <div className={styles.mePopContainer}>
          <div className={styles.mePopWrapper}>
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

export default MePop;
