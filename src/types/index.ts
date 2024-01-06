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
    optimism?: string;
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
  reconnect?: boolean;
}

export declare namespace Req {
  interface Oauth {
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

  interface CreateSession {
    character_id?: string;
  }

  interface GetTokenPrice {
    token: string;
    currency: string;
  }

  interface ShareAIME {
    method: string;
    character_id: string;
  }

  interface TrainCharacterBasic {
    twitter_name: string;
    user_bio: string;
    avatar: string;
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

  interface LoginMethod extends Body {
    type?: string;
    name?: string;
    method?: string;
    url?: string;
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

  interface OpenAIWhisper extends Body {
    text?: string;
  }

  interface Profile extends Body {
    id?: string;
    bio?: string;
    credit?: string;
    created_at?: string;
    referral_code?: string;
    telegram?: {
      name?: string;
      avatar_uri?: string;
    };
    twitter?: {
      name?: string;
      avatar_uri?: string;
    };
  }

  interface Wallet extends Body {
    chain_id?: string;
    address?: string;
  }

  interface Asset extends Body {
    chain_id?: string;
    asset_id?: string;
    name?: string;
    symbol?: string;
    type?: string;
    amount?: number;
    identifier?: string;
  }

  interface Extrinsic extends Body {
    chain_id?: string;
    tx?: string;
    asset_id?: string;
    name?: string;
    symbol?: string;
    from_address?: string;
    to_address?: string;
    type?: string;
    amount?: number;
    state?: string;
    finalized?: boolean;
    finalized_at?: string;
  }

  interface Session extends Body {
    id?: string;
    character_id?: string;
    state?: string;
    created_at?: string;
  }

  interface ChatHistory extends Body {
    from?: string;
    to?: string;
    type?: string;
    data?: string;
    created_at?: string;
  }

  interface TrainVoice extends Body {
    text?: string;
  }

  interface UploadIPFS extends Body {
    Name?: string;
    Hash?: string;
    Size?: string;
  }
}
