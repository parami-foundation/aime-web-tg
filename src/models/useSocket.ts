import { Character } from "@/types";

export enum SendMessageType {
  TEXT = "text",
  OBJECT = "object",
  BLOB = "blob",
  ARRAY_BUFFER = "arraybuffer",
}

export interface ChatbotProps {
  character: Character;
  reconnect: boolean;
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

};