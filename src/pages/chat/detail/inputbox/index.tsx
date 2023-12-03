import React, { useEffect } from "react";
import styles from "./style.less";
import { BiMicrophone } from "react-icons/bi";
import { HiArrowNarrowRight } from "react-icons/hi";
import { CgKeyboard } from "react-icons/cg";
import { Input } from "antd";
import { useModel } from "@umijs/max";
import BuyModal from "../buyModal";
import { AIME_CONTRACT, DEBUG, PROJECT_CONFIG } from "@/constants/global";
import { useContractRead } from "wagmi";
import { formatEther } from "viem";

const InputBox: React.FC<{
  isTextMode: boolean;
  setIsTextMode: React.Dispatch<React.SetStateAction<boolean>>;
  handsFreeMode: () => void;
  textMode: () => void;
  inputBoxContainer: React.RefObject<HTMLDivElement>;
  setDisableMic: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isTextMode, setIsTextMode, inputBoxContainer, handsFreeMode, textMode, setDisableMic }) => {
  const { SendMessageType, sendOverSocket } = useModel("useWebsocket");
  const { accessToken } = useModel("useAccess");
  const { address } = useModel("useWallet");
  const { telegramDataString, miniAppUtils, telegramWebApp } = useModel("useTelegram");
  const { transactionHashs } = useModel("useContract");
  const { isRecording } = useModel("useRecorder");
  const { speechInterim } = useModel("useChat");
  const { character } = useModel("useSetting");

  const [inputValue, setInputValue] = React.useState<string>();
  const [isBuyModalVisible, setIsBuyModalVisible] = React.useState<boolean>(false);
  const [transactionHash, setTransactionHash] = React.useState<`0x${string}` | undefined>();

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

  const getPowerBalance = () => {
    const { data: balance }: {
      data?: bigint;
      isError: boolean;
      isLoading: boolean;
    } = useContractRead({
      address: DEBUG ? `0x${AIME_CONTRACT.Goerli.Powers}` : `0x${AIME_CONTRACT.Arbitrum.Powers}`,
      abi: require("@/abis/AIMePowers.json"),
      functionName: "powerBalance",
      args: [DEBUG ? `0x${character?.wallet?.goerli}` : `0x${character?.wallet?.arbitrum}`, address],
    });

    return balance ?? 0n;
  };

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
                You own {getPowerBalance()?.toString() ?? "0"} Power of {character?.name}
              </div>
            </div>
          )}
          <div className={styles.inputBoxWrapperRow}>
            <div
              className={styles.inputBox}
              style={{
                width: getPowerBalance() === 0n ? "calc(100% - 55px)" : "100%",
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
            {!!address && formatEther(getPowerBalance() ?? 0n) === "0" && (
              <div
                className={styles.buyButton}
                onClick={() => {
                  !!telegramDataString ? miniAppUtils?.openLink(`${PROJECT_CONFIG?.url}/bridge?token=${accessToken}&action=buypower&characterId=${character?.id}#tgWebAppData=${encodeURIComponent(telegramDataString)}`) : setIsBuyModalVisible(true);
                  !!telegramDataString && telegramWebApp?.close();
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
        transactionHash={transactionHash}
        setTransactionHash={setTransactionHash}
      />
    </>
  )
};

export default InputBox;
