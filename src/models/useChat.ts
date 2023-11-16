import { DEBUG, WEBSOCKET_CONFIG } from "@/constants/global";
import { Character } from "@/service/typing";
import { useModel } from "@umijs/max";
import { notification } from "antd";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export enum MessageType {
  MESSAGE = "message",
  SCORE = "score",
  THINK = "think",
  DATA = "data",
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
  content?: SendMessage;
}

export default () => {
  const { accessToken } = useModel("useAccess");
  const [socket, setSocket] = useState<WebSocket>();
  const [messageEnd, setMessageEnd] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageDisplay[]>([]);
  const [character, setCharacter] = useState<Character>();
  const [rewardModal, setRewardModal] = useState<boolean>(false);
  const [storedMessageSession, setStoredMessageSession] = useState<
    Map<string, Character>
  >(new Map());
  const [currentSessionId, setCurrentSessionId] = useState<string>();

  const handleAiMessage = (message: MessageDisplay, character: Character) => {
    setMessages((prev) => {
      return [
        ...prev,
        {
          id: message?.id,
          type: MessageType.MESSAGE,
          sender: character?.name,
          content: message.content,
        },
      ];
    });
  };

  const handleThink = (message: SendMessage, character: Character) => {
    setMessages((prev) => {
      return [
        ...prev,
        {
          type: MessageType.THINK,
          sender: character?.name,
          content: message,
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
          content: {
            text: score.toString(),
          },
        },
      ];
    });
  };

  const handleSendMessage = async (message: SendMessage) => {
    setMessages([
      ...messages,
      {
        type: MessageType.MESSAGE,
        sender: "User",
        content: message,
      },
    ]);
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
                    content: {
                      text: aiMessage?.data,
                    },
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

          setMessages((prev) => {
            return [
              ...prev,
              {
                id: new Uint8Array(e.data).slice(0, 15).toString(),
                type: MessageType.DATA,
                sender: character?.name,
                content: {
                  text: new Uint8Array(e.data).slice(16),
                },
              },
            ];
          });

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
    handleSendMessage,
    setCharacter,
    setRewardModal,
    setMessages,
    setStoredMessageSession,
  };
};
