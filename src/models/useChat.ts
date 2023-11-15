import { DEBUG, WEBSOCKET_CONFIG } from "@/constants/global";
import { Character } from "@/service/typing";
import { notification } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
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
  give_token?: boolean;
}

export interface SendMessage {
  text?: string;
  context?: {
    buypower?: string;
    login?: {
      wallet_address?: string;
    };
  };
}

export interface MessageDisplay {
  type?: MessageType;
  sender?: string;
  content?: SendMessage;
}

export default () => {
  const [socket, setSocket] = useState<WebSocket>();
  const [messageEnd, setMessageEnd] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageDisplay[]>([]);
  const [character, setCharacter] = useState<Character>();
  const [rewardModal, setRewardModal] = useState<boolean>(false);

  const handleAiMessage = (message: SendMessage, character: Character) => {
    setMessages((prev) => {
      return [
        ...prev,
        {
          type: MessageType.MESSAGE,
          sender: character?.name,
          content: message,
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

  const connectSocket = async (props: ChatbotProps, authToken?: string) => {
    const language = window.navigator.languages;
    const { character } = props;
    const clientId = uuidv4();
    let ws: WebSocket;
    ws = new WebSocket(
      `${WEBSOCKET_CONFIG.scheme}://${WEBSOCKET_CONFIG.host}/ws/${clientId}?language=${language}&character_id=${character?.character_id}&token=${authToken}&platform=web`
    );
    ws.binaryType = "arraybuffer";
    setSocket(ws);

    ws.onopen = () => {
      if (DEBUG) {
        notification.info({
          key: "debug",
          message: "WebSocket",
          description: "WebSocket connected",
        });
        console.log("ws connected");
      }
    };

    ws.onclose = () => {
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

    ws.onerror = (err) => {
      if (DEBUG) {
        notification.error({
          key: "debug",
          message: "WebSocket",
          description: err.toString(),
        });
        console.log("ws error", err);
      }
    };

    ws.onmessage = (e) => {
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

          if (!!aiMessage?.data) {
            switch (aiMessage?.type) {
              case "text":
                handleAiMessage(
                  {
                    text: aiMessage?.data,
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
                type: MessageType.DATA,
                sender: character?.name,
                content: e?.data,
              },
            ];
          });

          break;
      }
    };
  };

  return {
    connectSocket,
    socket,
    messageEnd,
    messages,
    character,
    rewardModal,
    handleSendMessage,
    setCharacter,
    setRewardModal,
    setMessages,
  };
};
