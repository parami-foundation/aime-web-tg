import React from "react";
import styles from "./style.less";
import { BiMicrophone } from "react-icons/bi";
import { HiArrowNarrowRight } from "react-icons/hi";
import { CgKeyboard } from "react-icons/cg";
import { Input } from "antd";
import { useModel } from "@umijs/max";
import BuyModal from "../buyModal";

const InputBox: React.FC<{
  value?: string;
  onChange: (value: string) => void;
  inputBoxContainer?: React.RefObject<HTMLDivElement>;
}> = ({ value, onChange, inputBoxContainer }) => {
  const { handleSendMessage } = useModel("useChat");
  const { address } = useModel("useAccess");
  const { transactionHashs } = useModel("useContract");
  const [buyModalVisible, setBuyModalVisible] = React.useState<boolean>(false);
  const [type, setType] = React.useState<string>("text");
  const [recording, setRecording] = React.useState<boolean>(false);

  return (
    <>
      <div
        className={styles.inputBoxContainer}
        ref={inputBoxContainer}
      >
        <div className={styles.inputBoxWrapper}>
          {!!address && (
            <div className={styles.inputBoxWrapperRow}>
              <div className={styles.inputBoxWrapperTip}>
                You own 1 Power of Justinsuntron
              </div>
            </div>
          )}
          <div className={styles.inputBoxWrapperRow}>
            <div
              className={styles.inputBox}
              style={{
                width: !!address ? "calc(100% - 55px)" : "100%",
              }}
            >
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
                              buypower: Array.from(transactionHashs.keys())[0],
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
                            buypower: Array.from(transactionHashs.keys())[0],
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
            {!!address && (
              <div
                className={styles.buyButton}
                onClick={() => {
                  setBuyModalVisible(true);
                }}
              >
                Buy
              </div>
            )}
          </div>
        </div>
      </div>
      <BuyModal
        visible={buyModalVisible}
        setVisible={setBuyModalVisible}
      />
    </>
  )
};

export default InputBox;
