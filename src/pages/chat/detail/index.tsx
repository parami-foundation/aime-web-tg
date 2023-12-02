import React, { useEffect, useRef } from "react";
import styles from "./style.less";
import { MdOutlineAnalytics } from "react-icons/md";
import InputBox from "./inputbox";
import AiPop from "./pop/ai";
import MePop from "./pop/me";
import { history, useModel } from "@umijs/max";
import InfoCard from "./infoCard";
import { charactersData } from "@/mocks/character";
import { AccessLayout } from "@/layouts/access";
import { BiHomeAlt } from "react-icons/bi";
import { AiOutlineStar } from "react-icons/ai";
import { IoShareSocialOutline } from "react-icons/io5";
import { playAudios } from "@/utils/audioUtils";
import ShareModal from "./shareModal";

export interface LBAudioElement extends HTMLAudioElement {
  setSinkId(id: string): Promise<void>;
};

const Chat: React.FC = () => {
  const { accessToken } = useModel("useAccess");
  const { messages, messageList, clearChatContent } = useModel("useChat");
  const { SendMessageType, socketIsOpen, storedMessageSession, closeSocket, connectSocket, sendOverSocket } = useModel("useWebsocket");
  const { isPlaying, audioContext, audioQueue, incomingStreamDestination, rtcConnectionEstablished, setAudioPlayerRef, setIsPlaying, popAudioQueueFront, closePeer, connectPeer, stopAudioPlayback } = useModel("useWebRTC");
  const { selectedSpeaker, selectedMicrophone, character, isMute, setIsMute, setCharacter, getAudioList } = useModel("useSetting");
  const { mediaRecorder, vadEvents, enableVAD, closeVAD, startRecording, stopRecording, vadEventsCallback, closeMediaRecorder, connectMicrophone, disableVAD, disconnectMicrophone } = useModel("useRecorder");

  const chatWrapper = React.useRef<HTMLDivElement>(null);
  const msgList = React.useRef<HTMLDivElement>(null);
  const inputBoxContainer = React.useRef<HTMLDivElement>(null);
  const [disableMic, setDisableMic] = React.useState<boolean>(true);
  const [isTextMode, setIsTextMode] = React.useState<boolean>(true);
  const [shareModalVisible, setShareModalVisible] = React.useState<boolean>(false);
  const [msgScrolled, setMsgScrolled] = React.useState<boolean>(false);

  // Audio player
  const audioPlayerRef = useRef<LBAudioElement>(null);
  const audioQueueRef = useRef(audioQueue);

  // subscribe to audioQueue changes
  useEffect(() => {
    audioQueueRef.current = audioQueue;
  }, [audioQueue]);

  useEffect(() => {
    setAudioPlayerRef(audioPlayerRef);
  }, []);

  // Demo
  useEffect(() => {
    if (!accessToken || !charactersData.size) return;
    setCharacter(Array.from(charactersData.values())[0]);
    closeSocket();
    clearChatContent();
    connectSocket({
      character: Array.from(charactersData.values())[0],
      onReturn: () => {
        setCharacter({});
      }
    }, storedMessageSession.get(Array.from(charactersData.values())[0].id!) ?? undefined);
  }, [accessToken, charactersData]);

  useEffect(() => {
    if (!!mediaRecorder) {
      closeMediaRecorder();
    }
    if (!!rtcConnectionEstablished) {
      closePeer();
    }
    if (!disableMic) {
      getAudioList().then(
      ).then(() => {
        connectPeer().then(
          () => {
            connectMicrophone();
            initializeVAD();
          }
        );
      });
    }
  }, [selectedMicrophone, isTextMode, disableMic]);

  function initializeVAD() {
    if (vadEvents) {
      closeVAD();
    }
    vadEventsCallback(
      () => {
        stopAudioPlayback();
        startRecording();
      },
      () => {
        // Stops recording and send interim audio clip to server.
        sendOverSocket(SendMessageType.TEXT, '[&Speech]');
        stopRecording();
      },
      () => {
        sendOverSocket(SendMessageType.TEXT, '[SpeechFinished]');
      })
    if (!isTextMode && !disableMic) {
      enableVAD();
    }
  };

  useEffect(() => {
    if (!mediaRecorder || !socketIsOpen || !rtcConnectionEstablished) {
      return;
    }
    initializeVAD();
  }, []);

  useEffect(() => {
    // The chrome on android seems to have problems selecting devices.
    if (typeof audioPlayerRef.current?.setSinkId === 'function') {
      audioPlayerRef.current?.setSinkId(selectedSpeaker.values().next().value);
    }
  }, [selectedSpeaker]);

  // Audio Playback
  useEffect(() => {
    if (isPlaying && !!audioContext) {
      console.log("playback");
      playAudios(
        audioContext,
        audioPlayerRef,
        audioQueueRef,
        isPlaying,
        setIsPlaying,
        incomingStreamDestination!,
        popAudioQueueFront
      );
    }
  }
    , [isPlaying, audioPlayerRef]);

  function handsFreeMode() {
    setIsTextMode(false);
    if (!disableMic) {
      enableVAD();
    }
  };

  function textMode() {
    setIsTextMode(true);
    disableVAD();
  };

  function toggleMute() {
    if (!isMute) {
      stopAudioPlayback();
    }
    setIsMute(!isMute);
  };

  function handleMic() {
    if (disableMic) {
      enableVAD();
    } else {
      disableVAD();
    }
    setDisableMic(!disableMic);
  };

  const cleanUpStates = () => {
    disableVAD();
    closeVAD();
    closeMediaRecorder();
    closePeer();
    closeSocket();
    clearChatContent();
    setCharacter({});
  };

  useEffect(() => {
    if (msgList.current) {
      msgList.current.scrollTop = msgList.current.scrollHeight;
      msgList.current.addEventListener("scroll", () => {
        setMsgScrolled(msgList.current?.scrollTop !== msgList.current?.scrollHeight)
      });
    }
  }, [messages, msgList.current]);

  useEffect(() => {
    if (!!inputBoxContainer.current && !!chatWrapper.current) {
      chatWrapper?.current?.setAttribute("style", `height: calc(100vh - ${inputBoxContainer.current?.clientHeight}px)`);
    }
  }, [inputBoxContainer.current, chatWrapper.current]);

  return (
    <AccessLayout>
      <div className={styles.chatContainer}>
        <audio
          ref={audioPlayerRef}
          className={styles.audioPlayer}
        >
          <source
            src=''
            type='audio/mp3'
          />
        </audio>
        <div
          className={styles.chatWrapper}
          ref={chatWrapper}
        >
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderButtons}>
              <div className={styles.chatHeaderLeft}>
                <div
                  className={styles.chatHeaderHome}
                  onClick={() => {
                    history.push("/home");
                  }}
                >
                  <BiHomeAlt
                    classNmame={styles.chatHeaderHomeIcon}
                  />
                  <span>Home</span>
                </div>
              </div>
              <div className={styles.chatHeaderRight}>
                <div className={styles.chatHeaderButton}>
                  <MdOutlineAnalytics />
                </div>
                <div className={styles.chatHeaderButton}>
                  <AiOutlineStar />
                </div>
                <div
                  className={styles.chatHeaderButton}
                  onClick={() => {
                    setShareModalVisible(true);
                  }}
                >
                  <IoShareSocialOutline />
                </div>
              </div>
            </div>
            <div
              className={styles.chatHeaderAvatar}
              style={{
                height: msgScrolled ? "80px" : "180px",
                width: msgScrolled ? "80px" : "180px",
              }}
            >
              <img
                src={character?.avatar_url}
                alt="avatar"
              />
            </div>
            <div className={styles.chatHeaderName}>
              {character?.name}
            </div>
          </div>
          <div
            className={styles.chatContent}
            ref={msgList}
          >
            <div className={styles.chatInfo}>
              <InfoCard />
            </div>
            {!!messageList.size && Array.from(messageList?.keys())?.map((key) => {
              return (
                <React.Fragment
                  key={key}
                >
                  {key.split("/")[1] === "character" && (
                    <AiPop
                      data={messageList?.get(key)}
                      data-id={key}
                    />
                  )}
                  {key.split("/")[1] === "user" && (
                    <MePop
                      data={messageList?.get(key)}
                      data-id={key}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <InputBox
          isTextMode={isTextMode}
          setIsTextMode={setIsTextMode}
          inputBoxContainer={inputBoxContainer}
          handsFreeMode={handsFreeMode}
          textMode={textMode}
          setDisableMic={setDisableMic}
        />
      </div>
      <ShareModal
        visible={shareModalVisible}
        setVisible={setShareModalVisible}
      />
    </AccessLayout>
  )
};

export default Chat;
