import { NETWORK_CONFIG, PROJECT_CONFIG } from "./global";

export const WALLETCONNECT_CONFIG = {
  chains: NETWORK_CONFIG.chains,
  defaultChain: NETWORK_CONFIG.chains[0],
  projectId: "e395ecfaccf8c7f6408a5fff1de2d024",
  metadata: {
    name: PROJECT_CONFIG.name,
    description: PROJECT_CONFIG.description,
    url: PROJECT_CONFIG.url,
    icons: [`${PROJECT_CONFIG.url}/logo.svg`],
  },
};
