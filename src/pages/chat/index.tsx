import React from "react";
import styles from "./style.less";
import { AccessLayout } from "@/layouts/access";
import NavBar from "@/components/navBar";
import CardItem from "./cardItem";

const Chat: React.FC = () => {
  return (
    <AccessLayout>
      <div className={styles.chatContainer}>
        <div className={styles.chatWrapper}>
          <div className={styles.chatContent}>
            <CardItem />
            <CardItem />
          </div>
        </div>
        <NavBar />
      </div>
    </AccessLayout>
  )
};

export default Chat;
