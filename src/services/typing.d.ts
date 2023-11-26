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
  character_id?: string;
  avatar_url?: string;
  avatar_key?: string;
  background?: string;
  token_icon?: string;
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

  interface GetTokenPrice {
    token: string;
    currency: string;
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

  interface GetTokenPrice extends Body {
    [key: string]: any;
  }
}
