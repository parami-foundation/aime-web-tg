export interface Character {
  avatar?: string;
  author_name?: string;
  avatar_id?: string;
  avatar_url?: string;
  character_id?: string;
  image_url?: string;
  name?: string;
  source?: string;
  twitter_handle?: string;
  voice_id?: string;
  contract_address?: string;
}

export interface CharacterInfo {
  name?: string;
  handle?: string;
  id?: string;
  avatar?: string;
  avatarKey?: string;
  background?: string;
  tokenIcon?: string;
  questions?: string[];
}

export interface ChatHistory {
  character_id?: string;
  client_message_unicode?: string;
  message_id?: string;
  platform?: string;
  server_message_unicode?: string;
  session_id?: string;
  timestamp?: string;
  user_id?: string;
}

export declare namespace Req {
  interface OauthTelegram {
    init_data?: string;
    address?: string;
    message?: string;
    signature?: string;
    type?: string;
  }
}

export declare namespace Resp {
  interface Body {
    response?: any;
    data?: any;
  }

  interface OauthTelegram extends Body {
    status?: string;
    access_token?: string;
    type?: string;
    expire?: number;
  }
}

export const characters: CharacterInfo[] = [
  {
    name: "Justin Sun",
    handle: "justinsuntron",
    character_id: "justin_sun",
    avatar_url:
      "https://pbs.twimg.com/profile_images/1490173066357342208/MZyfamFE.jpg",
    avatarKey: "MZyfamFE",
    background:
      "https://pbs.twimg.com/media/F0V34ZLaUAEqltw?format=jpg&name=medium",
    tokenIcon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    questions: ["Sir wen moon?", "Where are you?", "Give me some TRX!"],
  },
];
