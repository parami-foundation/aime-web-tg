import { v4 as uuidv4 } from "uuid";
import React, { useEffect } from "react";
import { useModel } from "@umijs/max";
import { DEBUG, WEBSOCKET_CONFIG } from "@/constants/global";
import { Character } from "@/services/typing";
import { buf2hex } from "@/libs/hex";
import { charactersData } from "@/mocks/character";

export enum SendMessageType {
  TEXT = "text",
  OBJECT = "object",
  BLOB = "blob",
  ARRAY_BUFFER = "arraybuffer",
}

export interface ChatbotProps {
  character: Character;
  onReturn: () => void;
}

export interface AIResponse {
  type?: string;
  data?: string;
  sentence_id?: string;
  give_token?: boolean;
  end?: boolean;
}

export interface SendMessage {
  text?: string | Uint8Array;
  context?: {
    buypower?: string;
    login?: {
      wallet_address?: string;
    };
  };
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
  const [socketIsOpen, setSocketIsOpen] = React.useState<boolean>(false);
  const [currentSessionId, setCurrentSessionId] = React.useState<string>();
  const [storedMessageSession, setStoredMessageSession] = React.useState<
    Map<string, string>
  >(new Map());

  useEffect(() => {
    (async () => {
      const storedSession =
        localStorage.getItem("aime:messageSession") ||
        (await telegramCloudStorage?.get("aime:messageSession"));
      if (!!storedSession && JSON.parse(storedSession).length > 0) {
        const session = new Map(JSON.parse(storedSession));
        setStoredMessageSession(session as Map<string, string>);
      }
    })();
  }, []);

  const sendOverSocket = (
    type: SendMessageType,
    data: string | SendMessage | ArrayBuffer | Blob
  ) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      switch (type) {
        case SendMessageType.TEXT:
          socket?.send(data as string);
          break;

        case SendMessageType.OBJECT:
          const id = uuidv4().replace(/-/g, "");
          setMessages((prev) => {
            return [
              ...prev,
              {
                id: id,
                type: MessageType.MESSAGE,
                sender: "user",
                data: (data as SendMessage)?.text,
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
              data: (data as SendMessage)?.text,
              timestamp: Date.now(),
            });
            prev.set(`${id}/user`, list);
            return prev;
          });

          socket?.send(JSON.stringify(data));
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
    if (!socket || !!accessToken) {
      const ws_url = `${WEBSOCKET_CONFIG.scheme}://${WEBSOCKET_CONFIG.host}`;
      // const language = languageCode[preferredLanguage.values().next().value];
      const language = window.navigator.languages;
      const { character } = props;
      setCharacter(character);

      const session_Id = sessionId ?? uuidv4();
      setCurrentSessionId(session_Id);

      setStoredMessageSession((prev) => {
        const session = prev;
        session.set(character.id ?? "", session_Id);
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

      const ws_path =
        ws_url +
        `/ws/${session_Id}?llm_model=${
          selectedModel.values().next().value
        }&platform=web&use_search=${enableGoogle}&use_quivr=${enableQuivr}&use_multion=${enableMultiOn}&character_id=${
          character.id ?? ""
        }&language=${language}&token=${accessToken}`;

      let socket = new WebSocket(ws_path);

      socket.binaryType = "arraybuffer";
      setSocket(socket);
    }
  };

  const closeSocket = () => {
    socket?.close();
    setSocket(null);
    setSocketIsOpen(false);
  };

  useEffect(() => {
    if (!socket) return;
    socket.onopen = () => {
      if (DEBUG) console.log("Socket connected");

      setSocketIsOpen(true);
    };

    socket.onclose = async (event) => {
      if (
        !!currentSessionId &&
        storedMessageSession.has(currentSessionId) &&
        socketIsOpen
      ) {
        const aiSession = storedMessageSession.get(currentSessionId);

        if (!!aiSession) {
          await connectSocket(
            {
              character: charactersData.get(aiSession) ?? {},
              onReturn: () => {
                setCharacter({});
              },
            },
            currentSessionId
          );
        }
      }

      console.log("Socket closed", event);
      setSocketIsOpen(false);
    };

    socket.onmessage = socketOnMessageHandler;

    socket.onerror = (error) => {
      if (DEBUG) console.log(`WebSocket Error: `, error);
    };
  }, [socket]);

  return {
    SendMessageType,
    socket,
    socketIsOpen,
    currentSessionId,
    storedMessageSession,
    setCurrentSessionId,
    connectSocket,
    closeSocket,
    sendOverSocket,
  };
};
