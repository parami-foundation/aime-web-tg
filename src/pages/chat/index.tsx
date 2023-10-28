import React, { useEffect } from "react";
import styles from "./style.less";
import { MdOutlineAnalytics } from "react-icons/md";
import InputBox from "./inputbox";
import AiPop from "./pop/me";
import MePop from "./pop/ai";
import { useModel } from "@umijs/max";
import InfoCard from "./infoCard";
import { characters } from "@/service/typing.d";
import { MessageType } from "@/models/chat";

const Chat: React.FC = () => {
  const { connectSocket, setCharacter, messages } = useModel("chat");

  useEffect(() => {
    console.log(characters[0]);
    (async () => {
      const ws = await connectSocket({
        character: characters[0],
        onReturn: () => {
          setCharacter(undefined);
        }
      })
      ws.onopen = () => {
        ws.send("3");
      };
    })();
  }, []);

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
          {!!messages && messages.map((message, index) => {
            return (
              <>
                {console.log(message)}
                {message.sender === "Justin Sun" && (
                  <AiPop
                    type={message.type}
                    data={message.content}
                    key={index}
                  />
                )}
                {message.sender === "User" && (
                  <MePop
                    type={message.type}
                    data={message.content}
                    key={index}
                  />
                )}
              </>
            )
          })}
        </div>
        <InputBox />
      </div>
    </div>
  )
};

export default Chat;
