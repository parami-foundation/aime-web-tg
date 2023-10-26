import React, { useState } from "react";
import styles from "./style.less";
import { BiMicrophone } from "react-icons/bi";
import { HiArrowNarrowRight } from "react-icons/hi";
import { CgKeyboard } from "react-icons/cg";
import { Input } from "antd";

const InputBox: React.FC = () => {
  const [type, setType] = useState<string>("text");
  const [recording, setRecording] = useState<boolean>(false);

  return (
    <div className={styles.inputBoxContainer}>
      <div className={styles.inputBoxWrapper}>
        <div className={styles.inputBox}>
          <div
            className={styles.inputBoxSwitch}
            onClick={() => {
              if (type === "text") {
                setType("microphone");
              } else {
                setType("text");
              }
            }}
          >
            {type === "text" ? (
              <BiMicrophone
                className={styles.inputBoxSwitchIcon}
              />
            ) : (
              <CgKeyboard
                className={styles.inputBoxSwitchIcon}
              />
            )}
          </div>
          {type === "text" ? (
            <>
              <div className={styles.inputBoxInput}>
                <Input
                  bordered={false}
                  placeholder="Enter something..."
                  className={styles.inputBoxInputInput}
                />
              </div>
              <div className={styles.inputBoxSend}>
                <HiArrowNarrowRight
                  className={styles.inputBoxSendIcon}
                />
              </div>
            </>
          ) : (
            <div
              className={styles.inputBoxRecord}
            >
              Hold to record audio
            </div>
          )}
        </div>
      </div>
    </div>
  )
};

export default InputBox;
