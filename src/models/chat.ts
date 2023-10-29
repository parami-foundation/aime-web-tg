import { DEBUG, WEBSOCKET_CONFIG } from "@/constants/global";
import { Character } from "@/service/typing";
import { notification } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export enum MessageType {
  MESSAGE = "message",
  SCORE = "score",
  THINK = "think",
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

export interface MessageDisplay {
  type?: MessageType;
  sender?: string;
  content?: string;
}

export default () => {
  const [socket, setSocket] = useState<WebSocket>();
  const [messageEnd, setMessageEnd] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageDisplay[]>([]);
  const [character, setCharacter] = useState<Character>();
  const [rewardModal, setRewardModal] = useState<boolean>(false);
  const [audioQueue, setAudioQueue] = useState<BinaryData[]>([]);
  const [currentAudio, setCurrentAudio] = useState<BinaryData>();

  const audioPlayer = useRef<HTMLAudioElement>(null);

  const handleAiMessage = (message: string, character: Character) => {
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

  const handleThink = (message: string, character: Character) => {
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
          content: score.toString(),
        },
      ];
    });
  };

  const handleSendMessage = async (message: string) => {
    setMessages([
      ...messages,
      {
        type: MessageType.MESSAGE,
        sender: "User",
        content: message,
      },
    ]);
    socket?.send(message);
  };

  const playAudio = (audio: BinaryData) => {
    let blob = new Blob([audio], { type: "audio/mp3" });
    let url = URL.createObjectURL(blob);
    const player = audioPlayer.current;

    if (!player) return;
    return new Promise((resolve) => {
      player.src = url;
      player.muted = true;
      player.onended = resolve;
      player
        .play()
        .then(() => {
          player.muted = false;
        })
        .catch((err) => {
          if (DEBUG) {
            notification.error({
              key: "debug",
              message: "Audio",
              description: err.toString(),
            });
            console.log("audio error", err);
          }
        });
    });
  };

  const connectSocket = async (props: ChatbotProps, authToken?: string) => {
    const { character, onReturn } = props;
    const clientId = uuidv4();
    let ws: WebSocket;
    ws = new WebSocket(
      `${WEBSOCKET_CONFIG.scheme}://${WEBSOCKET_CONFIG.host}/ws/${clientId}?character=${character?.character_id}&platform=web`
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
                handleAiMessage(aiMessage?.data, character);
                if (!!aiMessage?.give_token) {
                  setRewardModal(true);
                }
                break;
              case "score":
                handleScore(parseInt(aiMessage?.data), character);
                break;
              case "think":
                handleThink(aiMessage?.data, character);
                break;
              case "end":
                setMessageEnd(true);
                break;
              default:
                break;
            }
          }
          break;
        case "object":
          if (DEBUG) {
            notification.info({
              key: "debug",
              message: "WebSocket",
              description: e.data,
            });
            console.log("ws message", e.data);
          }

          setAudioQueue((prev) => {
            return [...prev, e.data];
          });
          break;
        default:
          break;
      }
    };
  };

  useEffect(() => {
    if (!!audioQueue.length && !currentAudio) {
      setCurrentAudio(audioQueue[0]);
      setAudioQueue(audioQueue.slice(1));
    }
  }, [audioQueue, currentAudio]);

  useEffect(() => {
    if (!!currentAudio) {
      playAudio(currentAudio)?.then(() => {
        setCurrentAudio(undefined);
      });
    }
  }, [currentAudio]);

  return {
    connectSocket,
    socket,
    messageEnd,
    messages,
    character,
    rewardModal,
    audioPlayer,
    handleSendMessage,
    setCharacter,
    setRewardModal,
    setMessages,
  };
};
