import { DEBUG, WEBSOCKET_CONFIG } from "@/constants/global";
import { buf2hex } from "@/libs/hex";
import { Character } from "@/service/typing";
import { useModel } from "@umijs/max";
import { notification } from "antd";
import React from "react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export enum MessageType {
  MESSAGE = "message",
  SCORE = "score",
  THINK = "think",
  DATA = "data",
  AUDIO = "audio",
  VIDEO = "video",
  IMAGE = "image",
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

export interface MessageDisplay {
  id?: string;
  type?: MessageType;
  sender?: string;
  data?: string | Uint8Array;
}

export default () => {
  const { accessToken } = useModel("useAccess");
  const [socket, setSocket] = React.useState<WebSocket>();
  const [character, setCharacter] = React.useState<Character>();
  const [rewardModal, setRewardModal] = React.useState<boolean>(false);
  const [storedMessageSession, setStoredMessageSession] = React.useState<
    Map<string, Character>
  >(new Map());
  const [currentSessionId, setCurrentSessionId] = React.useState<string>();
  const [messages, setMessages] = React.useState<MessageDisplay[]>([]);
  const [messageList, setMessageList] = React.useState<
    Map<string, MessageDisplay[]>
  >(new Map());
  const [messageEnd, setMessageEnd] = React.useState<boolean>(false);

  const handleAiMessage = (message: MessageDisplay, character: Character) => {
    setMessages((prev) => {
      return [
        ...prev,
        {
          id: message?.id,
          type: MessageType.MESSAGE,
          sender: character?.name,
          data: message?.data,
        },
      ];
    });

    if (!!message?.id) {
      setMessageList((prev) => {
        const list = prev.get(`${message?.id}/${character?.name}`) || [];
        list.push(message);
        prev.set(`${message?.id}/${character?.name}`, list);
        return prev;
      });
    }
  };

  const handleThink = (message: SendMessage, character: Character) => {
    setMessages((prev) => {
      return [
        ...prev,
        {
          type: MessageType.THINK,
          sender: character?.name,
          content: message?.text,
        },
      ];
    });
  };

  const handleScore = (score: number, character: Character) => {
    setMessages((prev) => {
      return [
        ...prev,
        {
          type: MessageType.SCORE,
          sender: character?.name,
          content: score,
        },
      ];
    });
  };

  const handleSendMessage = async (message: SendMessage) => {
    setMessages((prev) => {
      return [
        ...prev,
        {
          type: MessageType.MESSAGE,
          sender: "user",
          content: message?.text,
        },
      ];
    });

    const id = uuidv4().replace(/-/g, "");

    setMessageList((prev) => {
      const list = prev.get(`${id}/User`) || [];
      list.push({
        id: id,
        sender: "user",
        type: MessageType.MESSAGE,
        data: message?.text,
      });
      prev.set(`${id}/User`, list);
      return prev;
    });

    socket?.send(JSON.stringify(message));
  };

  const connectSocket = async (
    props: ChatbotProps,
    sessionId?: string,
    authToken?: string
  ) => {
    const language = window.navigator.languages;
    const { character } = props;
    setCharacter(character);

    const session_Id = sessionId ?? uuidv4();
    setCurrentSessionId(session_Id);

    setStoredMessageSession((prev) => {
      return new Map(prev).set(session_Id, character);
    });

    const ws = new WebSocket(
      `${WEBSOCKET_CONFIG.scheme}://${WEBSOCKET_CONFIG.host}/ws/${session_Id}?language=${language}&character_id=${character?.character_id}&token=${authToken}&platform=web`
    );
    ws.binaryType = "arraybuffer";
    setSocket(ws);
  };

  useEffect(() => {
    if (!socket) return;
    socket.onopen = () => {
      if (DEBUG) {
        notification.info({
          key: "debug",
          message: "WebSocket",
          description: "WebSocket connected",
        });
        console.log("ws connected");
      }
    };

    socket.onclose = async () => {
      if (!!currentSessionId) {
        const aiSession = storedMessageSession.get(currentSessionId);

        if (!!aiSession) {
          await connectSocket(
            {
              character: aiSession,
              onReturn: () => {
                setCharacter(undefined);
              },
            },
            currentSessionId,
            accessToken
          );
        }
      }

      if (DEBUG) {
        notification.info({
          key: "debug",
          message: "WebSocket",
          description: "WebSocket disconnected",
          duration: 0,
        });
        console.log("ws disconnected");
      }
    };

    socket.onerror = (err) => {
      if (DEBUG) {
        notification.error({
          key: "debug",
          message: "WebSocket",
          description: err.toString(),
        });
        console.log("ws error", err);
      }
    };

    socket.onmessage = (e) => {
      if (DEBUG) {
        notification.info({
          key: "debug",
          message: "WebSocket",
          description: "WebSocket message",
        });
        console.log("ws message", e);
      }

      switch (typeof e?.data) {
        case "string":
          setMessageEnd(false);
          const message = e?.data;
          const aiMessage: AIResponse = JSON.parse(message);

          if (DEBUG) {
            notification.info({
              key: "debug",
              message: "WebSocket",
              description: JSON.stringify(aiMessage),
            });
            console.log("aiMessage", aiMessage);
          }

          if (!!aiMessage?.data && !!character) {
            switch (aiMessage?.type) {
              case "text":
                handleAiMessage(
                  {
                    id: aiMessage?.sentence_id,
                    type: MessageType.MESSAGE,
                    sender: character?.name,
                    data: aiMessage?.data,
                  },
                  character
                );
                if (!!aiMessage?.give_token) {
                  setRewardModal(true);
                }
                break;
              case "score":
                handleScore(parseInt(aiMessage?.data), character);
                break;
              case "think":
                handleThink(
                  {
                    text: aiMessage?.data,
                  },
                  character
                );
                break;
              case "end":
                setMessageEnd(true);
                break;
              default:
                break;
            }
          }
          break;
        default:
          if (DEBUG) {
            notification.info({
              key: "debug",
              message: "WebSocket",
              description: e.data,
            });
            console.log("ws message", e.data);
          }

          const id = buf2hex(new Uint8Array(e.data).slice(0, 16)).toString();
          const text = new Uint8Array(e.data).slice(16);

          setMessages((prev) => {
            return [
              ...prev,
              {
                id: id,
                type: MessageType.DATA,
                sender: character?.name,
                content: {
                  text: text,
                },
              },
            ];
          });

          if (!!id) {
            setMessageList((prev) => {
              const list = prev.get(`${id}/${character?.name}`) || [];
              list.push({
                id: id,
                sender: character?.name,
                type: MessageType.DATA,
                data: text,
              });
              prev.set(`${id}/${character?.name}`, list);
              return prev;
            });
          }

          break;
      }
    };
  }, [socket, character]);

  // Store messages session in local storage
  useEffect(() => {
    localStorage.setItem(
      "aime:chat:sessions",
      JSON.stringify(Array.from(storedMessageSession))
    );
  }, [storedMessageSession]);

  // Load messages session from local storage
  useEffect(() => {
    const sessions = localStorage.getItem("aime:chat:sessions");
    if (!!sessions) {
      setStoredMessageSession(new Map(JSON.parse(sessions)));
    }
  }, []);

  return {
    connectSocket,
    socket,
    messageEnd,
    messages,
    character,
    rewardModal,
    storedMessageSession,
    messageList,
    handleSendMessage,
    setCharacter,
    setRewardModal,
    setMessages,
    setMessageList,
    setStoredMessageSession,
  };
};
