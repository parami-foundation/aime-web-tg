import React, { useEffect } from "react";
import styles from "./style.less";
import { BiMicrophone } from "react-icons/bi";
import { HiArrowNarrowRight } from "react-icons/hi";
import { CgKeyboard } from "react-icons/cg";
import { Input } from "antd";
import { useModel } from "@umijs/max";
import BuyModal from "../buyModal";
import { PROJECT_CONFIG } from "@/constants/global";

const InputBox: React.FC<{
  isTextMode: boolean;
  setIsTextMode: React.Dispatch<React.SetStateAction<boolean>>;
  handsFreeMode: () => void;
  textMode: () => void;
  inputBoxContainer: React.RefObject<HTMLDivElement>;
  setDisableMic: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isTextMode, setIsTextMode, inputBoxContainer, handsFreeMode, textMode, setDisableMic }) => {
  const { SendMessageType, sendOverSocket } = useModel("useWebsocket");
  const { address, accessToken } = useModel("useAccess");
  const { telegramDataString, miniAppUtils } = useModel("useTelegram");
  const { transactionHashs } = useModel("useContract");
  const { isRecording } = useModel("useRecorder");
  const { speechInterim } = useModel("useChat");
  const { character } = useModel("useSetting");

  const [inputValue, setInputValue] = React.useState<string>();
  const [isBuyModalVisible, setIsBuyModalVisible] = React.useState<boolean>(false);

  useEffect(() => {
    if (!isTextMode) {
      // switch to hands free mode
      setDisableMic(false);
      handsFreeMode();
    } else {
      // switch to text mode
      textMode();
    }
  }, [isTextMode]);

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
                  console.log("switch");
                  setIsTextMode(!isTextMode);
                }}
              >
                {isTextMode ? (
                  <BiMicrophone
                    className={styles.inputBoxSwitchIcon}
                  />
                ) : (
                  <CgKeyboard
                    className={styles.inputBoxSwitchIcon}
                  />
                )}
              </div>
              {isTextMode ? (
                <>
                  <div className={styles.inputBoxInput}>
                    <Input
                      bordered={false}
                      placeholder="Enter something..."
                      className={styles.inputBoxInputInput}
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                      }}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && !!inputValue) {
                          await sendOverSocket(SendMessageType.OBJECT, {
                            text: inputValue,
                            context: {
                              buypower: Array.from(transactionHashs.keys())[0],
                              login: {
                                wallet_address: address,
                              },
                            }
                          });
                          setInputValue("");
                        }
                      }}
                    />
                  </div>
                  <div
                    className={styles.inputBoxSend}
                    onClick={async () => {
                      if (!!inputValue) {
                        await sendOverSocket(SendMessageType.OBJECT, {
                          text: inputValue,
                          context: {
                            buypower: Array.from(transactionHashs.keys())[0],
                            login: {
                              wallet_address: address,
                            },
                          }
                        });
                        setInputValue("");
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
                  {isRecording && speechInterim ? (
                    <>Listening...</>
                  ) : (
                    <>Please speak...</>
                  )}
                </div>
              )}
            </div>
            {!!address && (
              <div
                className={styles.buyButton}
                onClick={() => {
                  !!telegramDataString ? miniAppUtils?.openLink(`${PROJECT_CONFIG?.url}/bridge?token=${accessToken}&action=buypower&characterId=${character?.id}#tgWebAppData=${encodeURIComponent(telegramDataString)}`) : setIsBuyModalVisible(true);
                }}
              >
                Buy
              </div>
            )}
          </div>
        </div>
      </div>
      <BuyModal
        visible={isBuyModalVisible}
        setVisible={setIsBuyModalVisible}
      />
    </>
  )
};

export default InputBox;
