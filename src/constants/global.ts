import { arbitrum } from "wagmi/chains";

export const DEBUG = false;

export const PROJECT_CONFIG = {
  name: "AIME",
  description: "Parami AIME",
  url: "https://aime-tg.parami.io",
};

export const NETWORK_CONFIG = {
  chains: [arbitrum],
};

export const AIME_CONTRACT = {
  Goerli: {
    Powers: "A0A5366f28e36A219791F59cA8128FaD656Fbf92",
  },
  Arbitrum: {
    Powers: "be21B5812094bB808c4D88CCf62c8C7EC7b37Ab2",
  },
};

export const WEBSOCKET_CONFIG = {
  scheme: "wss",
  host: "beta-parami.quaere.app",
};

export const API_CONFIG = {
  scheme: "https",
  host: "aime-api-beta.parami.io",
  grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
};

export const ALCHEMY_CONFIG = {
  Georli: "bZy6cqaLUxCMRw2BJn76qNSK6gX7Ioij",
  Arbitrum: "DFaa0Hz4Kc9nYeqmcNcGdaM9kFuhC5Zd",
};

export const INFURA_CONFIG = {
  apiKey: "912a4876d6f449dea2143b0c6cf07e13",
};

export const WAITLIST_LINK = "https://form.typeform.com/to/Q7qTVjQW";

export const TELEGRAM_BOT = "aime_beta_bot";

export const TELEGRAM_AUTH_EXPIRE = 10 * 60 * 1000;