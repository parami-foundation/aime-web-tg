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
    Powers: "968665c68b3B347c9E9553a87F4a84620718ca07",
  },
  Arbitrum: {
    Powers: "D21881a9b32509fC0C042682E8a61f57d8B57C11",
  },
};

export const WEBSOCKET_CONFIG = {
  scheme: "wss",
  host: "beta-parami.quaere.app",
};

export const API_CONFIG = {
  scheme: "https",
  host: "beta-parami.quaere.app",
};

export const DEMO_CONFIG = {
  Sun: "CecB7683E1Fa399Ff2457dE8B33D9110939547d6",
};

export const ALCHEMY_CONFIG = {
  Georli: "bZy6cqaLUxCMRw2BJn76qNSK6gX7Ioij",
};

export const INFURA_CONFIG = {
  apiKey: "912a4876d6f449dea2143b0c6cf07e13",
};

export const BIND_WALLET_MESSAGE = "AIME:bind_wallet";

export const WAITLIST_LINK = "https://form.typeform.com/to/Q7qTVjQW";

export const TELEGRAM_BOT = "aime_beta_bot";
