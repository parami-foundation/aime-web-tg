import React, { useEffect, useRef } from "react";
import styles from "./style.less";
import { MdOutlineAnalytics } from "react-icons/md";
import InputBox from "./inputbox";
import AiPop from "./pop/ai";
import MePop from "./pop/me";
import { history, useModel } from "@umijs/max";
import InfoCard from "./infoCard";
import { characters } from "@/service/typing.d";
import { AccessLayout } from "@/layouts/access";
import { BiHomeAlt } from "react-icons/bi";
import { AiOutlineStar } from "react-icons/ai";
import { SendMessage, FullMessageDisplay } from "@/models/useChat";

const ChatDemo: React.FC = () => {
  const { accessToken } = useModel("useAccess");
  const { connectSocket, setCharacter, messages } = useModel("useChat");
  const [inputValue, setInputValue] = React.useState<string>();
  const [messageList, setMessageList] = React.useState<Map<string, FullMessageDisplay[]>>(new Map());

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
        }, undefined, accessToken);
      }
    })();
  }, [accessToken]);

  useEffect(() => {
    if (msgList.current) {
      msgList.current.scrollTop = msgList.current.scrollHeight;
    }
  }, [messages, msgList.current]);

  useEffect(() => {
    if (!!messages) {
      messages?.forEach((message) => {
        if (!!message?.id) {
          setMessageList((prev) => {
            const list = prev.get(message?.id ?? "") || [];
            list.push(message);
            prev.set(message?.id ?? "", list);
            return new Map(prev);
          });
        }
      });
    }
  }, [messages]);

  return (
    <AccessLayout>
      <div className={styles.chatContainer}>
        <div className={styles.chatWrapper}>
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderButtons}>
              <div className={styles.chatHeaderLeft}>
                <div
                  className={styles.chatHeaderHome}
                  onClick={() => {
                    history.push("/home");
                  }}
                >
                  <BiHomeAlt
                    classNmame={styles.chatHeaderHomeIcon}
                  />
                  <span>Home</span>
                </div>
              </div>
              <div className={styles.chatHeaderRight}>
                <div className={styles.chatHeaderButton}>
                  <MdOutlineAnalytics />
                </div>
                <div className={styles.chatHeaderButton}>
                  <AiOutlineStar />
                </div>
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
            {!!messages && messages?.map((message) => {
              return (
                <>
                  {message?.sender === "Justin Sun" && (
                    <AiPop
                      type={message?.type}
                      data={(message?.content as SendMessage)?.text}
                      key={message?.id}
                    />
                  )}
                  {message?.sender === "User" && (
                    <MePop
                      type={message?.type}
                      data={(message?.content as SendMessage)?.text}
                      key={message?.id}
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
