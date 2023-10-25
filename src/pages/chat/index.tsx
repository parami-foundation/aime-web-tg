import React from "react";
import styles from "./style.less";
import { MdOutlineAnalytics } from "react-icons/md";
import { RiWalletLine } from "react-icons/ri";
import { Button } from "antd";
import { useWeb3Modal } from "@web3modal/react";
import InputBox from "./inputbox";
import AiPop from "./pop/ai";
import MePop from "./pop/me";
import { useModel } from "@umijs/max";

const Chat: React.FC = () => {
  const { setWalletModalOpen } = useModel("wagmiClient");
  const { open } = useWeb3Modal();

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
            <p>
              👋 Hi, my friend it’s justinsuntron, let me take you on the path of wealth and freedom. Anyway, please <b>log in your web3 account</b> first.
            </p>
            <div className={styles.chatHeaderInfoButtons}>
              <Button
                block
                type="primary"
                size="large"
                className={styles.chatHeaderInfoButton}
                onClick={() => {
                  setWalletModalOpen(true);
                }}
              >
                <RiWalletLine
                  className={styles.chatHeaderInfoButtonIcon}
                />
                Connect Wallet
              </Button>
            </div>
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
