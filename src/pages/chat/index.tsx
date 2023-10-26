import React from "react";
import styles from "./style.less";
import { MdOutlineAnalytics } from "react-icons/md";
import InputBox from "./inputbox";
import AiPop from "./pop/me";
import MePop from "./pop/ai";
import { useModel } from "@umijs/max";
import InfoCard from "./infoCard";

const Chat: React.FC = () => {
  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatWrapper}>
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderButtons}>
            <div className={styles.chatHeaderButton}>
              <MdOutlineAnalytics />
            </div>
          </div>
          <div className={styles.chatHeaderAvatar}>
            <img
              src="https://media.licdn.com/dms/image/C5103AQEjthnHx0FTLQ/profile-displayphoto-shrink_800_800/0/1536214237739?e=2147483647&v=beta&t=Th9UXbvF5Rc9oF6E-C4HFotvCZQbDj-AH5BVN2wtWbw"
              alt="avatar"
            />
          </div>
          <div className={styles.chatHeaderInfo}>
            <InfoCard />
          </div>
        </div>
        <div className={styles.chatContent}>
          <AiPop />
          <MePop />
        </div>
        <InputBox />
      </div>
    </div>
  )
};

export default Chat;
