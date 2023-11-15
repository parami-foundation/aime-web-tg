import React, { useState } from "react";
import styles from "./style.less";
import { BiMicrophone } from "react-icons/bi";
import { HiArrowNarrowRight } from "react-icons/hi";
import { CgKeyboard } from "react-icons/cg";
import { Input } from "antd";
import { useModel } from "@umijs/max";

const InputBox: React.FC<{
  value?: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const { handleSendMessage } = useModel("useChat");
  const { address } = useModel("useAccess");
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
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value);
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && !!value) {
                      await handleSendMessage({
                        text: value,
                        context: {
                          // TODO: get from context
                          buypower: 'hash',
                          login: {
                            wallet_address: address,
                          },
                        }
                      });
                      onChange("");
                    }
                  }}
                />
              </div>
              <div
                className={styles.inputBoxSend}
                onClick={async () => {
                  if (!!value) {
                    await handleSendMessage({
                      text: value,
                      context: {
                        // TODO: get from context
                        buypower: 'hash',
                        login: {
                          wallet_address: address,
                        },
                      }
                    });
                    onChange("");
                  }
                }}
              >
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
