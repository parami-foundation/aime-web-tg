import React, { useEffect } from "react";
import styles from "./style.less";
import { BiMicrophone } from "react-icons/bi";
import { HiArrowNarrowRight } from "react-icons/hi";
import { CgKeyboard } from "react-icons/cg";
import { Input } from "antd";
import { useModel } from "@umijs/max";
import BuyModal from "../buyModal";
import { AIME_CONTRACT, DEBUG, PROJECT_CONFIG } from "@/constants/global";
import { useAccount, useContractRead } from "wagmi";
import LoginModal from "@/components/loginModal";

const InputBox: React.FC<{
  isTextMode: boolean;
  setIsTextMode: React.Dispatch<React.SetStateAction<boolean>>;
  handsFreeMode: () => void;
  textMode: () => void;
  inputBoxContainer: React.RefObject<HTMLDivElement>;
  setDisableMic: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isTextMode, setIsTextMode, inputBoxContainer, handsFreeMode, textMode, setDisableMic }) => {
  const { handleSendMessage, connecting, SendMessageType } = useModel("useSocket");
  const { accessToken, accessTokenExpire } = useModel("useAccess");
  const { address } = useModel("useWallet");
  const { telegramDataString, telegramAuthType, miniAppUtils, telegramWebApp } = useModel("useTelegram");
  const { isRecording } = useModel("useRecorder");
  const { speechInterim, messageList } = useModel("useChat");
  const { character } = useModel("useSetting");

  const [inputValue, setInputValue] = React.useState<string>();
  const [isBuyModalVisible, setIsBuyModalVisible] = React.useState<boolean>(false);
  const [transactionHash, setTransactionHash] = React.useState<`0x${string}` | undefined>();
  const [balance, setBalance] = React.useState<bigint>(0n);

  const { isConnected } = useAccount();

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
    address: `0x${AIME_CONTRACT.Arbitrum.Powers}`,
    abi: require("@/abis/AIMePowers.json"),
    functionName: "powerBalance",
    args: [`0x${character?.wallet?.arbitrum}`, address],
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
              className={styles.buyButton}
              onClick={() => {
                (!!telegramDataString && !!telegramWebApp) ? miniAppUtils?.openLink(`${PROJECT_CONFIG?.url}/bridge?access_token=${accessToken}&access_token_expire=${accessTokenExpire}&action=buypower&characterId=${character?.id}&telegramDataString=${encodeURIComponent(telegramDataString)}&telegramAuthType=${telegramAuthType}`) : setIsBuyModalVisible(true);
                (!!telegramDataString && !!telegramWebApp) && telegramWebApp?.close();
              }}
            >
              Buy
            </div>
            <div
              className={styles.inputBox}
              style={{
                width: (!!address && balance === 0n) ? "calc(100% - 55px)" : "100%",
              }}
            >
              {!!messageList?.size && (
                <div
                  className={styles.inputBoxSwitch}
                  onClick={() => {
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
              )}
              {isTextMode ? (
                <>
                  <div className={styles.inputBoxInput}>
                    <Input
                      disabled={(!messageList?.size || connecting)}
                      bordered={false}
                      placeholder={(!messageList?.size || connecting) ? "Thinking..." : "Type something..."}
                      className={styles.inputBoxInputInput}
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                      }}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && !!inputValue && !!messageList?.size && !connecting) {
                          await handleSendMessage(SendMessageType.TEXT, inputValue);
                          setInputValue("");
                        }
                      }}
                    />
                  </div>
                  {!!messageList?.size && !connecting && (
                    <div
                      className={styles.inputBoxSend}
                      onClick={async () => {
                        if (!!inputValue) {
                          await handleSendMessage(SendMessageType.TEXT, inputValue);
                          setInputValue("");
                        }
                      }}
                    >
                      <HiArrowNarrowRight
                        className={styles.inputBoxSendIcon}
                      />
                    </div>
                  )}
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
          </div>
        </div>
      </div>
      <LoginModal
        visible={isBuyModalVisible && !isConnected}
        setVisible={() => { }}
        closeable={false}
      />
      <BuyModal
        visible={isBuyModalVisible && isConnected}
        setVisible={setIsBuyModalVisible}
        transactionHash={transactionHash}
        setTransactionHash={setTransactionHash}
      />
    </>
  )
};

export default InputBox;
