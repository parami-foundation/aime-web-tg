import React from "react";
import styles from "./style.less";
import { useModel } from "@umijs/max";

const AiPop: React.FC<{
  data?: any;
}> = ({ data }) => {
  return (
    <div className={styles.aiPopContainer}>
      <div className={styles.aiPopWrapper}>
        {typeof data === "string" && data}
        {typeof data === "object" && data?.map((item: any, index: number) => {
          switch (item?.type) {
            case "message":
              return (
                <div
                  className={styles.aiPopText}
                  key={index}
                >
                  {item?.data}
                </div>
              )
            case "data":
              break;
          }
        })}
      </div>
    </div>
  )
};

export default AiPop;
