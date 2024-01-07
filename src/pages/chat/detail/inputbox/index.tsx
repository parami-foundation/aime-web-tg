import React, { useEffect } from "react";
import styles from "./style.less";
import { BiMicrophone } from "react-icons/bi";
import { HiArrowNarrowRight } from "react-icons/hi";
import { CgKeyboard } from "react-icons/cg";
import { Input, message } from "antd";
import { useModel } from "@umijs/max";
import { AIME_CONTRACT, PROJECT_CONFIG } from "@/constants/global";
import { useAccount, useContractRead } from "wagmi";
import LoginModal from "@/components/login";
import Trade from "@/components/trade";
import { FaCoins } from "react-icons/fa";
import classNames from "classnames";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { TrainVoice, TranslationTTS } from "@/services/api";

const InputBox: React.FC<{
  isTextMode: boolean;
  setIsTextMode: React.Dispatch<React.SetStateAction<boolean>>;
  inputBoxContainer: React.RefObject<HTMLDivElement>;
}> = ({ isTextMode, setIsTextMode, inputBoxContainer }) => {
  const { handleSendMessage, connecting, SendMessageType } = useModel("useSocket");
  const { accessToken, accessTokenExpire } = useModel("useAccess");
  const { address, walletBinded } = useModel("useWallet");
  const { telegramDataString, telegramAuthType, miniAppUtils, telegramWebApp } = useModel("useTelegram");
  const { messageList } = useModel("useChat");
  const { character } = useModel("useSetting");

  const [inputValue, setInputValue] = React.useState<string>();
  const [isTradeModalVisible, setIsTradeModalVisible] = React.useState<boolean>(false);
  const [transactionHash, setTransactionHash] = React.useState<`0x${string}` | undefined>();
  const [balance, setBalance] = React.useState<bigint>(0n);
  const [isRecording, setIsRecording] = React.useState<boolean>(false);

  const { isConnected } = useAccount();
  const recorderControls = useAudioRecorder();

  useEffect(() => {
    ; (async () => {
      if (!!recorderControls.recordingBlob && !isRecording && !!accessToken) {
        const { response, data } = await TranslationTTS(recorderControls.recordingBlob, accessToken);
        if (response?.status === 200 && !!data.text) {
          await handleSendMessage(SendMessageType.TEXT, data.text);
        } else {
          message.error("Please speak again");
        }
      }
    })();
  }, [recorderControls.recordingBlob, isRecording, accessToken]);

  const powerBalance: {
    data?: bigint;
    isError: boolean;
    isLoading: boolean;
  } = useContractRead({
    address: `0x${AIME_CONTRACT.Optimism.Powers}`,
    abi: require("@/abis/AIMePowers.json"),
    functionName: "powerBalance",
    args: [`0x${character?.wallet?.optimism}`, address],
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
                (!!telegramDataString && !!miniAppUtils) ? miniAppUtils?.openLink(`${PROJECT_CONFIG?.url}/hub?access_token=${accessToken}&access_token_expire=${accessTokenExpire}&action=trade&characterId=${character?.id}&telegramDataString=${encodeURIComponent(telegramDataString)}&telegramAuthType=${telegramAuthType}`) : setIsTradeModalVisible(true);
                (!!telegramDataString && !!telegramWebApp) && telegramWebApp?.close();
              }}
            >
              <FaCoins />
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
                  className={styles.inputRecordContainer}
                  onClick={async () => {
                    setIsRecording(!isRecording);
                    if (!isRecording) {
                      recorderControls.startRecording();
                    } else {
                      recorderControls.stopRecording();
                    }
                  }}
                >
                  <AudioRecorder
                    onRecordingComplete={(blob) => {
                      const url = URL.createObjectURL(blob);
                      const audio = document.createElement("audio");
                      audio.src = url;
                      audio.controls = true;
                      document.body.appendChild(audio);
                    }}
                    audioTrackConstraints={{
                      noiseSuppression: true,
                      echoCancellation: true,
                    }}
                    classes={{
                      AudioRecorderClass: styles.inputBoxRecorder,
                    }}
                  />
                  <div
                    className={classNames(styles.inputBoxRecord, {
                      [styles.inputBoxRecordActive]: isRecording,
                    })}
                  >
                    <span>
                      {isRecording ? 'Click to stop' : 'Click to record'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <LoginModal
        visible={isTradeModalVisible && (!isConnected || !walletBinded)}
        setVisible={() => {
          setIsTradeModalVisible(false);
        }}
      />
      <Trade
        visible={isTradeModalVisible && isConnected && walletBinded}
        setVisible={setIsTradeModalVisible}
        transactionHash={transactionHash}
        setTransactionHash={setTransactionHash}
      />
    </>
  )
};

export default InputBox;
