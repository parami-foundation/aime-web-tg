import React from "react";
import styles from "./style.less";
import { BiMicrophone } from "react-icons/bi";
import { HiArrowNarrowRight } from "react-icons/hi";
import { Input } from "antd";

const InputBox: React.FC = () => {
  return (
    <div className={styles.inputBoxContainer}>
      <div className={styles.inputBoxWrapper}>
        <div className={styles.inputBox}>
          <div className={styles.inputBoxMicrophone}>
            <BiMicrophone
              className={styles.inputBoxMicrophoneIcon}
            />
          </div>
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
        </div>
      </div>
    </div>
  )
};

export default InputBox;
