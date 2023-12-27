import { API_CONFIG, DEBUG, WEBSOCKET_CONFIG } from "@/constants/global";
import { buf2hex } from "@/libs/hex";
import { CreateSession } from "@/services/api";
import { Character, Resp } from "@/types";
import { useModel } from "@umijs/max";
import { notification } from "antd";
import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { v4 as uuidv4 } from "uuid";

export enum SendMessageType {
  TEXT = "text",
  OBJECT = "object",
  BLOB = "blob",
  ARRAY_BUFFER = "arraybuffer",
}

export interface AIResponse {
  type?: string;
  data?: string;
  sentence_id?: string;
  give_token?: boolean;
  end?: boolean;
  action?: string;
  address?: string;
}

export default () => {
  const {
    appendChatContent,
    appendInterimChatContent,
    appendSpeechInterim,
    clearSpeechInterim,
    setMessageGroupId,
    setIsThinking,
    setSender,
    setMessageEnd,
    setMessages,
    setMessageList,
    setRewardModal,
    setChatSession,
    MessageType,
  } = useModel("useChat");
  const {
    audioQueue,
    shouldPlayAudio,
    setShouldPlayAudio,
    setIsPlaying,
    pushAudioQueue,
  } = useModel("useWebRTC");
  const {
    isMute,
    character,
    setCharacter,
  } = useModel("useSetting");
  const { accessToken } = useModel("useAccess");

  const [socketIsOpen, setSocketIsOpen] = useState<boolean>(false);
  const [currentSession, setCurrentSession] = useState<Resp.Session>();
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const [reconnect, setReconnect] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);

  const language = window.navigator.languages;

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(socketUrl, {
    queryParams: {
      platform: "web",
      character_id: character.id ?? "",
      language: language[0],
      token: accessToken ?? "",
      reconnect: reconnect ? "true" : "false",
    },
    share: true,
    reconnectInterval: (attemptNumber) =>
      Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
    reconnectAttempts: 100,
    retryOnError: true,
    shouldReconnect: (closeEvent) => {
      DEBUG && console.log("Reconnect Event", closeEvent);
      setReconnect(true);
      setConnecting(true);
      return true;
    },
    onOpen: () => {
      DEBUG && console.log("Socket connected");
      setSocketIsOpen(true);
      setConnecting(false);
    },
    onClose: (event) => {
      DEBUG && console.log("Socket closed", event);
    },
    onReconnectStop: (event) => {
      DEBUG && console.log("Socket reconnect stop", event);
      notification.error({
        key: "socketReconnectStop",
        message: "Lost connection with AI",
        description: "Please check your network connection.",
      });
    },
  });

  useEffect(() => {
    switch (typeof lastMessage?.data) {
      case "string":
        const message = lastMessage?.data;
        const aiMessage: AIResponse = JSON.parse(message);

        if (DEBUG) console.log("AI Message", aiMessage);

        if (!!aiMessage?.data) {
          switch (aiMessage?.type) {
            case "text":
              if (
                message === "[end]\n" ||
                message.match(/\[end=([a-zA-Z0-9]+)]/)
              ) {
                appendChatContent();
                const messageGroupIdMatches = message.match(
                  /\[end=([a-zA-Z0-9]+)]/
                );
                if (!!messageGroupIdMatches) {
                  const messageGroupId = messageGroupIdMatches[1];
                  setMessageGroupId(messageGroupId);
                }
                setMessageEnd(true);
              } else if (message.startsWith("[+]You said: ")) {
                // [+] indicates the transcription is done.
                let msg = message.split("[+]You said: ");
                setSender("user");
                appendInterimChatContent(msg[1]);
                appendChatContent();
                clearSpeechInterim();
                setMessages((prev) => {
                  return [
                    ...prev,
                    {
                      id: uuidv4().replace(/-/g, ""),
                      type: MessageType.MESSAGE,
                      sender: "user",
                      data: msg[1],
                      timestamp: Date.now(),
                    },
                  ];
                });
              } else if (
                message.startsWith("[=]" || message.match(/\[=([a-zA-Z0-9]+)]/))
              ) {
                // [=] or [=id] indicates the response is done
                appendChatContent();
              } else if (message.startsWith("[+&]")) {
                let msg = message.split("[+&]");
                appendSpeechInterim(msg[1]);
              }

              if (!!aiMessage?.sentence_id) {
                setSender("character");
                appendInterimChatContent(aiMessage.data);
                setMessages((prev) => {
                  return [
                    ...prev,
                    {
                      id: aiMessage?.sentence_id,
                      type: MessageType.MESSAGE,
                      sender: "character",
                      data: aiMessage?.data,
                      timestamp: Date.now(),
                    },
                  ];
                });
                setMessageList((prev) => {
                  const list =
                    prev.get(`${aiMessage?.sentence_id}/character`) || [];
                  list.push({
                    id: aiMessage?.sentence_id,
                    type: MessageType.MESSAGE,
                    sender: "character",
                    data: aiMessage?.data,
                    action: aiMessage?.action,
                    timestamp: Date.now(),
                  });
                  prev.set(`${aiMessage?.sentence_id}/character`, list);
                  return prev;
                });
                appendSpeechInterim(aiMessage.data);

                // if user interrupts the previous response, should be able to play audios of new response
                setShouldPlayAudio(true);

                if (!!aiMessage?.give_token) {
                  setRewardModal(true);
                }
              }
              break;

            case "score":
              setMessages((prev) => {
                return [
                  ...prev,
                  {
                    type: MessageType.SCORE,
                    sender: "character",
                    data: aiMessage?.data,
                    timestamp: Date.now(),
                  },
                ];
              });
              break;

            case "think":
              setMessages((prev) => {
                return [
                  ...prev,
                  {
                    type: MessageType.THINK,
                    sender: "character",
                    data: aiMessage?.data,
                    timestamp: Date.now(),
                  },
                ];
              });
              setIsThinking(true);
              break;

            case "end":
              const id = uuidv4().replace(/-/g, "");
              setSender("character");
              setMessages((prev) => {
                return [
                  ...prev,
                  {
                    id: id,
                    type: MessageType.MESSAGE,
                    sender: "character",
                    data: aiMessage?.data,
                    timestamp: Date.now(),
                  },
                ];
              });
              !!aiMessage?.action && setMessageList((prev) => {
                prev.set(`${id}/character`, [
                  {
                    id: id,
                    type: MessageType.MESSAGE,
                    sender: "character",
                    action: aiMessage?.action,
                    timestamp: Date.now(),
                  }
                ]);
                return prev;
              });

              appendChatContent();
              setMessageEnd(true);
              const messageGroupIdMatches = message.match(
                /\[end=([a-zA-Z0-9]+)]/
              );
              if (!!messageGroupIdMatches) {
                const messageGroupId = messageGroupIdMatches[1];
                setMessageGroupId(messageGroupId);
              }
              break;
          }
        }
        break;

      default:
        if (DEBUG) console.log("ws message", lastMessage?.data);

        const id = buf2hex(new Uint8Array(lastMessage?.data).slice(0, 16)).toString();
        const data = new Uint8Array(lastMessage?.data).slice(16);

        if (!!id) {
          setMessages((prev) => {
            return [
              ...prev,
              {
                id: id,
                type: MessageType.DATA,
                sender: "character",
                data: data,
                timestamp: Date.now(),
              },
            ];
          });

          setMessageList((prev) => {
            const list = prev.get(`${id}/character`) || [];
            list.push({
              id: id,
              type: MessageType.DATA,
              sender: "character",
              data: data,
              timestamp: Date.now(),
            });
            prev.set(`${id}/character`, list);
            return prev;
          });

          // binary data
          if (!shouldPlayAudio || isMute) {
            console.log("should not play audio");
            return;
          }
          pushAudioQueue(lastMessage?.data);
          if (audioQueue.length === 1) {
            setIsPlaying(true); // this will trigger playAudios in CallView.
          }
        }
    }
  }, [lastMessage]);

  const handleChangeSocketUrl = useCallback(async ({
    sessionId,
    character,
    accessToken,
    reconnect,
  }: {
    sessionId?: string;
    character?: Character;
    accessToken?: string;
    reconnect?: boolean;
  }) => {
    if (!accessToken) return;

    if (!sessionId) {
      const { response, data } = await CreateSession({
        character_id: character?.id,
      }, accessToken);

      if (response?.status === 200) {
        sessionId = data?.id;
        setCurrentSession({
          id: sessionId,
          character_id: character?.id,
          state: "active",
          created_at: Date.now().toString(),
        });
        if (!!data) {
          setChatSession((prev) => {
            const session = prev;
            session?.set(data?.character_id!, {
              id: data?.id,
              character_id: data?.character_id!,
              state: data?.state,
              created_at: data?.created_at,
            });
            return session;
          });
        }
      }
    };
    const url = `${WEBSOCKET_CONFIG.scheme}://${API_CONFIG.host}/ws/${sessionId}`;
    !!character && setCharacter(character);
    setReconnect(reconnect ?? false);
    setSocketUrl(url);
  }, []);

  const handleSendMessage = useCallback((
    type: SendMessageType,
    data: string | ArrayBuffer | Blob
  ) => {
    switch (type) {
      case SendMessageType.TEXT:
        const id = uuidv4().replace(/-/g, "");
        setMessages((prev) => {
          return [
            ...prev,
            {
              id: id,
              type: MessageType.MESSAGE,
              sender: "user",
              data: data as string,
              timestamp: Date.now(),
            },
          ];
        });
        setMessageList((prev) => {
          const list = prev.get(`${id}/user`) || [];
          list.push({
            id: id,
            sender: "user",
            type: MessageType.MESSAGE,
            data: data as string,
            timestamp: Date.now(),
          });
          prev.set(`${id}/user`, list);
          return prev;
        });

        sendMessage(data as string);
        break;
    }
    console.log("message sent to server");
  }, []);

  const connectionStatus: any = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  const handleCloseSocket = useCallback(() => {
    getWebSocket()?.close();
    setSocketIsOpen(false);
  }, []);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      setSocketIsOpen(true);
    } else {
      setSocketIsOpen(false);
    }
  }, [readyState]);

  return {
    SendMessageType,
    socketIsOpen,
    socketUrl,
    currentSession,
    connecting,
    reconnect,
    connectionStatus,
    setReconnect,
    setSocketUrl,
    setCurrentSession,
    handleChangeSocketUrl,
    handleSendMessage,
    handleCloseSocket,
  }
};