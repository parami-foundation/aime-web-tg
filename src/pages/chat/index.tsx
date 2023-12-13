import React, { useEffect } from "react";
import styles from "./style.less";
import { AccessLayout } from "@/layouts/access";
import { useModel } from "@umijs/max";
import NavBar from "@/components/navBar";
import CardItem from "./cardItem";
import { charactersData } from "@/mocks/character";

const Chat: React.FC = () => {
  const { chatSession } = useModel('useChat');

  return (
    <AccessLayout>
      <div className={styles.chatContainer}>
        <div className={styles.chatWrapper}>
          <div className={styles.chatContent}>
            {Array.from(chatSession?.keys()).map((key) => {
              const character = charactersData.get(key);
              const content = chatSession?.get(key);
              if (!character || !content) {
                return null;
              }

              return (
                <CardItem
                  key={key}
                  character={character}
                  chatSession={content}
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

export default Chat;
