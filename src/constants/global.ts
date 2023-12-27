import { optimism } from "wagmi/chains";

export const DEBUG = true;

export const PROJECT_CONFIG = {
  name: "AIME",
  description: "Parami AIME",
  url: "https://app.aime.bot",
};

export const NETWORK_CONFIG = {
  chains: [optimism],
};

export const AIME_CONTRACT = {
  Optimism: {
    Powers: "2a9Ec32e051F595d4F7e3a80c9e1A5B942b421E4",
  },
};

export const WEBSOCKET_CONFIG = {
  scheme: "wss",
  host: "beta-parami.quaere.app",
};

export const API_CONFIG = {
  scheme: "https",
  host: "api-beta.aime.bot",
  grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
};

export const ALCHEMY_CONFIG = {
  Optimism: "Co3hROG5cgCbbMsaIKiGjplscQUvJGhb",
};

export const INFURA_CONFIG = {
  apiKey: "912a4876d6f449dea2143b0c6cf07e13",
};

export const EXPLORER_CONFIG = {
  Optimism: "https://optimistic.etherscan.io",
}

export const WAITLIST_LINK = "https://form.typeform.com/to/Q7qTVjQW";

export const TELEGRAM_BOT = "aime_beta_bot";

export const TELEGRAM_AUTH_EXPIRE = 10 * 60 * 1000;