import React, { useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useModel } from "@umijs/max";
import { GetSession, GetSessionByCharacterId } from "@/services/api";
import { Resp } from "@/types";

export enum MessageType {
  MESSAGE = "message",
  SCORE = "score",
  THINK = "think",
  DATA = "data",
  AUDIO = "audio",
  VIDEO = "video",
  IMAGE = "image",
}

export interface Chat {
  from?: string;
  timestamp?: number;
  content?: string;
}

export interface MessageDisplay {
  id?: string;
  type?: MessageType;
  sender?: string;
  data?: string | Uint8Array;
  timestamp?: number;
}

export default () => {
  const { accessToken } = useModel('useAccess');
  const { telegramCloudStorage } = useModel('useTelegram');

  const [interimChat, setInterimChat] = React.useState<Chat | null>(null);
  const [messageGroupId, setMessageGroupId] = React.useState<string>("");
  const [chatContent, setChatContent] = React.useState<Chat[]>([]);
  const [speechInterim, setSpeechInterim] = React.useState<string>("");
  const [isThinking, setIsThinking] = React.useState<boolean>(false);
  const [messageEnd, setMessageEnd] = React.useState<boolean>(false);
  const [messages, setMessages] = React.useState<MessageDisplay[]>([]);
  const [messageList, setMessageList] = React.useState<
    Map<string, MessageDisplay[]>
  >(new Map());
  const [rewardModal, setRewardModal] = React.useState<boolean>(false);
  const [chatSession, setChatSession] = React.useState<
    Map<string, Resp.Session>
  >(new Map());

  const getSessionByCharacterId = useMemo(() => async (characterId: string) => {
    if (!accessToken) return;
    const { response, data } = await GetSessionByCharacterId(characterId, accessToken);
    if (response?.status === 200 && data.length > 0) {
      return data;
    } else {
      return [];
    }
  }, []);

  useEffect(() => {
    ; (async () => {
      const sessionMap = new Map<string, Resp.Session>();
      const session = JSON.parse(
        localStorage.getItem("aime:chatSession") || await telegramCloudStorage?.get("aime:chatSession") || "[]"
      );
      session?.forEach((session: [string, Resp.Session]) => {
        if (!session[1].character_id) return;
        sessionMap.set(session[1].character_id, session[1]);
      });
      setChatSession(sessionMap);

      if (!accessToken) return;
      const { response, data } = await GetSession(accessToken);
      if (response?.status === 200 && data.length > 0) {
        const sessionMap = new Map<string, Resp.Session>();
        setChatSession(() => {
          data?.forEach((session) => {
            // Only save the latest session
            if (!session.character_id || !!sessionMap.has(session?.character_id)) return;
            sessionMap.set(session.character_id, session);
          });
          return sessionMap;
        });
        localStorage.setItem(
          "aime:chatSession",
          JSON.stringify([...sessionMap])
        );
        telegramCloudStorage?.set(
          "aime:chatSession",
          JSON.stringify([...sessionMap])
        );
      }
    })()
  }, [accessToken]);

  useEffect(() => {
    const id = uuidv4().replace(/-/g, "");
    setMessages((prev) => {
      return [
        ...prev,
        {
          id: id,
          type: MessageType.MESSAGE,
          sender: "character",
          data: "Thinking...",
          timestamp: Date.now(),
        },
      ];
    });
    setMessageList((prev) => {
      const list = prev.get(`${id}/character/default`) || [];
      list.push({
        id: id,
        sender: "character",
        type: MessageType.MESSAGE,
        data: "Thinking...",
        timestamp: Date.now(),
      });
      prev.set(`${id}/character/default`, list);
      return prev;
    });
  }, []);

  const setSender = (sender: string) => {
    setInterimChat((prev) => {
      if (!!prev) {
        return { ...prev, from: sender };
      } else {
        return { from: sender, timestamp: Date.now() };
      }
    });
  };

  const appendInterimChatContent = (content: string) => {
    setInterimChat((prev) => {
      if (!!prev) {
        return {
          ...prev,
          content: `${"content" in prev ? prev.content : ""}` + content,
        };
      } else {
        return { content: content, timestamp: Date.now() };
      }
    });
  };

  const appendChatContent = () => {
    setInterimChat(null);
    setChatContent((prev) => [...prev, { ...interimChat }]);
  };

  const appendUserChat = (chat: string) => {
    setChatContent((prev) => [
      ...prev,
      { timestamp: Date.now(), from: "user", content: chat },
    ]);
  };

  const clearChatContent = () => {
    setChatContent([]);
    setInterimChat(null);
    setMessageList(new Map());
    setMessages([]);
  };

  const appendSpeechInterim = (str: string) => {
    setSpeechInterim((prev) => prev + str);
  };

  const clearSpeechInterim = () => {
    setSpeechInterim("");
  };

  return {
    MessageType,
    chatSession,
    messages,
    messageList,
    messageGroupId,
    chatContent,
    interimChat,
    speechInterim,
    isThinking,
    messageEnd,
    rewardModal,
    setChatSession,
    setMessages,
    setMessageList,
    setMessageGroupId,
    setSender,
    setIsThinking,
    setMessageEnd,
    setRewardModal,
    appendInterimChatContent,
    appendChatContent,
    appendUserChat,
    clearChatContent,
    appendSpeechInterim,
    clearSpeechInterim,
    getSessionByCharacterId,
  };
};
