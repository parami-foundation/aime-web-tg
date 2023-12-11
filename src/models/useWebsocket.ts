import { v4 as uuidv4 } from "uuid";
import React, { useEffect } from "react";
import { useModel } from "@umijs/max";
import { API_CONFIG, DEBUG, WEBSOCKET_CONFIG } from "@/constants/global";
import { Character, Resp } from "@/types";
import { buf2hex } from "@/libs/hex";
import { CreateSession } from "@/services/api";

export enum SendMessageType {
  TEXT = "text",
  OBJECT = "object",
  BLOB = "blob",
  ARRAY_BUFFER = "arraybuffer",
}

export interface ChatbotProps {
  character: Character;
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
    selectedModel,
    enableGoogle,
    enableQuivr,
    enableMultiOn,
    setCharacter,
  } = useModel("useSetting");
  const { accessToken } = useModel("useAccess");
  const { telegramCloudStorage } = useModel("useTelegram");

  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const [socketIsOpen, setSocketIsOpen] = React.useState<boolean>(true);
  const [currentSession, setCurrentSession] = React.useState<Resp.Session>();

  const sendOverSocket = (
    type: SendMessageType,
    data: string | ArrayBuffer | Blob
  ) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
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

          socket?.send(data as string);
          break;
      }
      console.log("message sent to server");
    } else {
      console.log("tries to send message to server but socket not open.");
    }
  };

  const socketOnMessageHandler = (event: MessageEvent<any>) => {
    switch (typeof event?.data) {
      case "string":
        const message = event.data;
        const aiMessage: AIResponse = JSON.parse(message);

        if (DEBUG) console.log("aiMessage", aiMessage);

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
        if (DEBUG) console.log("ws message", event.data);

        const id = buf2hex(new Uint8Array(event?.data).slice(0, 16)).toString();
        const data = new Uint8Array(event?.data).slice(16);

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
          pushAudioQueue(event.data);
          if (audioQueue.length === 1) {
            setIsPlaying(true); // this will trigger playAudios in CallView.
          }
        }
    }
  };

  const connectSocket = async (props: ChatbotProps, sessionId?: string) => {
    if (!socket && !!accessToken) {
      const ws_url = `${WEBSOCKET_CONFIG.scheme}://${API_CONFIG.host}`;
      // const language = languageCode[preferredLanguage.values().next().value];
      const language = window.navigator.languages;
      const { character } = props;
      setCharacter(character);

      if (!sessionId) {
        const { response, data } = await CreateSession({
          character_id: character.id,
        }, accessToken);

        if (response?.status === 200) {
          sessionId = data?.id;
          setCurrentSession({
            id: sessionId,
            character_id: character.id!,
            state: "active",
            created_at: Date.now().toString(),
          });
          if (!!data) {
            setChatSession((prev) => {
              const session = prev;
              session.set(data?.character_id!, {
                id: data?.id,
                character_id: data?.character_id!,
                state: data?.state,
                created_at: data?.created_at,
              });
              localStorage.setItem(
                "aime:messageSession",
                JSON.stringify([...session])
              );
              telegramCloudStorage?.set(
                "aime:messageSession",
                JSON.stringify([...session])
              );
              return session;
            });
          }
        }
      } else {
        setCurrentSession({
          id: sessionId,
          character_id: character.id!,
          state: "active",
          created_at: Date.now().toString(),
        });
      }

      if (!sessionId) return;
      const ws_path =
        ws_url +
        `/ws/${sessionId}/?llm_model=${selectedModel.values().next().value
        }&platform=web&use_search=${enableGoogle}&use_quivr=${enableQuivr}&use_multion=${enableMultiOn}&character_id=${character.id ?? ""
        }&language=${language[0]}&token=${accessToken}`;

      let socket = new WebSocket(ws_path);

      socket.binaryType = "arraybuffer";
      setSocket(socket);

      socket.onopen = () => {
        if (DEBUG) console.log("Socket connected");

        setSocketIsOpen(true);
      };

      socket.onclose = async (event) => {
        console.log("Socket closed", event);

        if (!socketIsOpen) {
          connectSocket(
            {
              character: props.character,
            },
            sessionId,
          );
          console.log("reconnecting socket")
        }
      };

      socket.onmessage = socketOnMessageHandler;

      socket.onerror = (event) => {
        closeSocket();
        if (DEBUG) console.log(`WebSocket Error: `, event);
      };
    }
  };

  const closeSocket = () => {
    socket?.close();
    setSocket(null);
    setSocketIsOpen(false);
  };

  return {
    SendMessageType,
    socket,
    socketIsOpen,
    currentSession,
    setCurrentSession,
    connectSocket,
    closeSocket,
    sendOverSocket,
  };
};
