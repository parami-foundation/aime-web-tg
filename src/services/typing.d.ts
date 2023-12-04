export interface TelegramOauthDataOnauthProps {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: number;
  hash?: string;
}

export interface Character {
  id?: string;
  name?: string;
  handle?: string;
  avatar_url?: string;
  author_name?: string;
  description?: string;
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
  tags?: string[];
  chat_count?: number;
  value?: number;
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
    grant_type?: string;
    subject_token?: string;
    subject_issuer?: string;
  }

  interface BindWalletNonce {
    chain_id?: string;
    address?: string;
  }

  interface BindWallet {
    chain_id?: string;
    address?: string;
    signature?: string;
  }

  interface CreateTransaction {
    chain_id?: string;
    address?: string;
    hash?: string;
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

  interface Error extends Body {
    error?: string;
    error_description?: string;
  }

  interface OauthTelegram extends Body {
    error?: string;
    error_description?: string;
    access_token?: string;
    expires_in?: number;
    expired_at?: string;
    token_type?: string;
  }

  interface BindWalletNonce extends Body {
    error?: string;
    error_description?: string;
    chain_id?: string;
    nonce?: string;
    message?: string;
  }

  interface GetTokenPrice extends Body {
    [key: string]: any;
  }
}
