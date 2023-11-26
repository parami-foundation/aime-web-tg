import React from "react";

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
  };

  const appendSpeechInterim = (str: string) => {
    setSpeechInterim((prev) => prev + str);
  };

  const clearSpeechInterim = () => {
    setSpeechInterim("");
  };

  return {
    MessageType,
    messages,
    messageList,
    messageGroupId,
    chatContent,
    interimChat,
    speechInterim,
    isThinking,
    messageEnd,
    rewardModal,
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
  };
};
