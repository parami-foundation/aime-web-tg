import React, { useCallback, useEffect } from "react";
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
  const { accessToken, accessTokenExpire } = useModel("useAccess");
  const { address } = useModel("useWallet");
  const { telegramDataString, miniAppUtils, telegramWebApp } = useModel("useTelegram");
  const { transactionHashs } = useModel("useContract");
  const { isRecording } = useModel("useRecorder");
  const { speechInterim } = useModel("useChat");
  const { character } = useModel("useSetting");

  const [inputValue, setInputValue] = React.useState<string>();
  const [isBuyModalVisible, setIsBuyModalVisible] = React.useState<boolean>(false);
  const [transactionHash, setTransactionHash] = React.useState<`0x${string}` | undefined>();
  const [balance, setBalance] = React.useState<bigint>(0n);

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

  const { data }: {
    data?: bigint;
    isError: boolean;
    isLoading: boolean;
  } = useContractRead({
    address: DEBUG ? `0x${AIME_CONTRACT.Goerli.Powers}` : `0x${AIME_CONTRACT.Arbitrum.Powers}`,
    abi: require("@/abis/AIMePowers.json"),
    functionName: "powerBalance",
    args: [DEBUG ? `0x${character?.wallet?.goerli}` : `0x${character?.wallet?.arbitrum}`, address],
    onSuccess: (data) => {
      setBalance(data ?? 0n);
    }
  });

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
                You own {!!address && (balance?.toString() ?? "0")} Power of {character?.name}
              </div>
            </div>
          )}
          <div className={styles.inputBoxWrapperRow}>
            <div
              className={styles.inputBox}
              style={{
                width: (!!address && balance === 0n) ? "calc(100% - 55px)" : "100%",
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
                          await sendOverSocket(SendMessageType.TEXT, inputValue);
                          setInputValue("");
                        }
                      }}
                    />
                  </div>
                  <div
                    className={styles.inputBoxSend}
                    onClick={async () => {
                      if (!!inputValue) {
                        await sendOverSocket(SendMessageType.TEXT, inputValue);
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
            {!!address && formatEther(balance ?? 0n) === "0" && (
              <div
                className={styles.buyButton}
                onClick={() => {
                  (!!telegramDataString && !!telegramWebApp) ? miniAppUtils?.openLink(`${PROJECT_CONFIG?.url}/bridge?access_token=${accessToken}&access_token_expire=${accessTokenExpire}&action=buypower&characterId=${character?.id}&telegramDataString=${encodeURIComponent(telegramDataString)}`) : setIsBuyModalVisible(true);
                  (!!telegramDataString && !!telegramWebApp) && telegramWebApp?.close();
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
