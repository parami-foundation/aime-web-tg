import React, { useEffect, useRef } from "react";
import styles from "./style.less";
import { MdOutlineAnalytics } from "react-icons/md";
import InputBox from "./inputbox";
import AiPop from "./pop/ai";
import MePop from "./pop/me";
import { history, useModel, useParams } from "@umijs/max";
import { charactersData } from "@/mocks/character";
import { AccessLayout } from "@/layouts/access";
import { BiHomeAlt } from "react-icons/bi";
import { AiOutlineStar } from "react-icons/ai";
import { IoShareSocialOutline } from "react-icons/io5";
import { playAudios } from "@/utils/audioUtils";
import ShareModal from "./shareModal";
import queryString from "query-string";
import { message, Image } from "antd";
import { GetChatHistory } from "@/services/api";
import { v4 as uuidv4 } from "uuid";
import { MessageType } from "@/models/useChat";

export interface LBAudioElement extends HTMLAudioElement {
  setSinkId(id: string): Promise<void>;
};

const Chat: React.FC = () => {
  const { accessToken } = useModel("useAccess");
  const { messages, messageList, chatSession, clearChatContent, setMessageList, setMessages } = useModel("useChat");
  const { SendMessageType, socketIsOpen, closeSocket, connectSocket, sendOverSocket } = useModel("useWebsocket");
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

  const search = queryString.parse(window.location.search);

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

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    ; (async () => {
      if (!accessToken || !search?.session || !character) return;
      const { response, data } = await GetChatHistory(accessToken, search?.session as string);
      if (response?.status === 200 && !!data?.length) {
        closeSocket();
        clearChatContent();
        data.map((item) => {
          const id = uuidv4().replace(/-/g, "");
          setMessages((prev) => {
            return [
              ...prev,
              {
                id: id,
                type: MessageType.MESSAGE,
                sender: item?.from === character?.id ? "character" : "user",
                data: item?.data,
                timestamp: Date.now(),
              },
            ];
          });
          setMessageList((prev) => {
            const list = prev.get(`${id}/${item?.from === character?.id ? "character" : "user"}`) || [];
            list.push({
              id: id,
              sender: item?.from === character?.id ? "character" : "user",
              type: MessageType.MESSAGE,
              data: item?.data,
              timestamp: Date.now(),
            });
            prev.set(`${id}/${item?.from === character?.id ? "character" : "user"}`, list);
            return prev;
          });
        });
      }
    })()
  }, [search?.session, accessToken, character]);

  useEffect(() => {
    if (!accessToken || !charactersData.size || !id) return;
    setCharacter(charactersData.get(id) || {});
  }, [id, accessToken, charactersData]);

  useEffect(() => {
    ; (async () => {
      if (!Object.keys(character).length || !charactersData.size) return;
      if (!accessToken || !charactersData.size || !id) {
        history.push("/home");
        return;
      }
      if (!charactersData.get(id)) {
        history.push("/home");
        message.error("Character not found");
        return;
      }

      closeSocket();
      if (!search?.session) {
        clearChatContent();
      }

      if (!search?.session) {
        connectSocket({
          character: charactersData.get(id) ?? {},
          onReturn: () => {
            setCharacter({});
          }
        }, search?.session as string || chatSession.get(character?.id)?.id);
      }
    })()
  }, [search?.session, id, accessToken, charactersData, character, chatSession]);

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
                  onClick={async () => {
                    await cleanUpStates();
                    history.push("/home");
                  }}
                >
                  <BiHomeAlt
                    className={styles.chatHeaderHomeIcon}
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
              <Image
                className={styles.chatHeaderAvatarImg}
                src={character?.avatar_url}
                fallback={require('@/assets/me/avatar.png')}
                preview={false}
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
            {console.log("messageList", messageList)}
            {!!messageList.size && Array.from(messageList?.keys())?.map((key) => {
              return (
                <React.Fragment
                  key={key}
                >
                  {key.split("/")[1] === "character" && (
                    <AiPop
                      data={messageList?.get(key)}
                      data-id={key}
                      key={key}
                    />
                  )}

                  {key.split("/")[1] === "user" && (
                    <MePop
                      data={messageList?.get(key)}
                      data-id={key}
                      key={key}
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
