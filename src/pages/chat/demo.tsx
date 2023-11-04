import React, { useEffect, useRef } from "react";
import styles from "./style.less";
import { MdOutlineAnalytics } from "react-icons/md";
import InputBox from "./inputbox";
import AiPop from "./pop/ai";
import MePop from "./pop/me";
import { useModel } from "@umijs/max";
import InfoCard from "./infoCard";
import { characters } from "@/service/typing.d";
import { AccessLayout } from "@/layouts/access";

const ChatDemo: React.FC = () => {
  const { accessToken } = useModel("checkAccess");
  const { connectSocket, setCharacter, messages, socket } = useModel("chat");
  const [inputValue, setInputValue] = React.useState<string>();

  const msgList = useRef<HTMLDivElement>(null);

  // Demo
  useEffect(() => {
    (async () => {
      if (!!accessToken) {
        await connectSocket({
          character: characters[0],
          onReturn: () => {
            setCharacter(undefined);
          }
        }, accessToken);
      }
    })();
  }, [accessToken]);

  useEffect(() => {
    if (msgList.current) {
      msgList.current.scrollTop = msgList.current.scrollHeight;
    }
  }, [messages, msgList.current]);

  return (
    <AccessLayout>
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
            <div className={styles.chatHeaderName}>
              justinsuntron
            </div>
          </div>
          <div
            className={styles.chatContent}
            ref={msgList}
          >
            <div className={styles.chatInfo}>
              <InfoCard />
            </div>
            {!!messages && messages.map((message, index) => {
              return (
                <>
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
        </div>
        <InputBox
          value={inputValue}
          onChange={setInputValue}
        />
      </div>
    </AccessLayout>
  )
};

export default ChatDemo;
