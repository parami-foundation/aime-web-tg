export interface Character {
  id?: string;
  name?: string;
  handle?: string;
  avatar_url?: string;
  author_name?: string;
  background?: string;
  source?: string;
  twitter?: {
    id?: string;
    name?: string;
    screen_name?: string;
    profile_image_url_https?: string;
  };
  token?: {
    id?: string;
    name?: string;
    symbol?: string;
    icon?: string;
  };
  voice_id?: string;
  share_message?: string;
  wallet?: {
    goerli?: string;
    arbitrum?: string;
  };
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

export interface StartParam {
  characterId?: string;
  address?: string;
  signature?: string;
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
