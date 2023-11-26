import React, { useEffect } from "react";
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

const Chat: React.FC = () => {
  const { accessToken } = useModel("useAccess");
  const { connectSocket, setCharacter, messages, messageList } = useModel("useWebsocket");

  const chatWrapper = React.createRef<HTMLDivElement>();
  const msgList = React.createRef<HTMLDivElement>();
  const inputBoxContainer = React.createRef<HTMLDivElement>();

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
    if (!!inputBoxContainer.current && !!chatWrapper.current) {
      chatWrapper?.current?.setAttribute("style", `height: calc(100vh - ${inputBoxContainer.current?.clientHeight}px)`);
    }
  }, [inputBoxContainer.current, chatWrapper.current]);

  return (
    <AccessLayout>
      <div className={styles.chatContainer}>
        <div
          className={styles.chatWrapper}
          ref={chatWrapper}
        >
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
            {!!messageList.size && Array.from(messageList?.keys())?.map((key) => {
              return (
                <React.Fragment
                  key={key}
                >
                  {key.split("/")[1] === "Justin Sun" && (
                    <AiPop
                      data={messageList?.get(key)}
                      data-id={key}
                    />
                  )}
                  {key.split("/")[1] === "User" && (
                    <MePop
                      data={messageList?.get(key)}
                      data-id={key}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <InputBox
          inputBoxContainer={inputBoxContainer}
        />
      </div>
    </AccessLayout>
  )
};

export default Chat;
