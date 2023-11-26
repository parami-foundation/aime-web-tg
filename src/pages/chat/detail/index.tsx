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
import { playAudios } from "@/utils/audioUtils";

export interface LBAudioElement extends HTMLAudioElement {
  setSinkId(id: string): Promise<void>;
};

const Chat: React.FC = () => {
  const { accessToken } = useModel("useAccess");
  const { messages, messageList, clearChatContent } = useModel("useChat");
  const { SendMessageType, socketIsOpen, closeSocket, connectSocket, sendOverSocket } = useModel("useWebsocket");
  const { isPlaying, audioContext, audioQueue, incomingStreamDestination, rtcConnectionEstablished, setAudioPlayerRef, setIsPlaying, popAudioQueueFront, closePeer, connectPeer, stopAudioPlayback } = useModel("useWebRTC");
  const { selectedSpeaker, selectedMicrophone, isMute, setIsMute, setCharacter, getAudioList } = useModel("useSetting");
  const { mediaRecorder, vadEvents, enableVAD, closeVAD, startRecording, stopRecording, vadEventsCallback, closeMediaRecorder, connectMicrophone, disableVAD } = useModel("useRecorder");

  const chatWrapper = React.useRef<HTMLDivElement>(null);
  const msgList = React.useRef<HTMLDivElement>(null);
  const inputBoxContainer = React.useRef<HTMLDivElement>(null);
  const [disableMic, setDisableMic] = React.useState<boolean>(false);
  const [isTextMode, setIsTextMode] = React.useState<boolean>(true);

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
    if (!accessToken || !charactersData.length) return;
    connectSocket({
      character: charactersData[0],
      onReturn: () => {
        setCharacter({});
      }
    })
  }, [accessToken, charactersData]);

  useEffect(() => {
    if (!!mediaRecorder) {
      closeMediaRecorder();
    }
    if (!!rtcConnectionEstablished) {
      closePeer();
    }
    getAudioList().then(
    ).then(() => {
      connectPeer().then(
        () => {
          connectMicrophone();
          initializeVAD();
        }
      );
    });
  }, [selectedMicrophone, isTextMode]);

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
    closeSocket();
    clearChatContent();
    connectSocket({
      character: charactersData[0],
      onReturn: () => {
        setCharacter({});
      }
    });
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
    console.log(audioQueue.length)
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
              </div>
            </div>
            <div className={styles.chatHeaderAvatar}>
              <img
                src="https://media.licdn.com/dms/image/C5103AQEjthnHx0FTLQ/profile-displayphoto-shrink_800_800/0/1536214237739?e=2147483647&v=beta&t=Th9UXbvF5Rc9oF6E-C4HFotvCZQbDj-AH5BVN2wtWbw"
                alt="avatar"
              />
            </div>
            <div className={styles.chatHeaderName}>
              justinsuntron
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
        />
      </div>
    </AccessLayout>
  )
};

export default Chat;
