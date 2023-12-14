import { NETWORK_CONFIG, PROJECT_CONFIG } from "./global";

export const WALLETCONNECT_CONFIG = {
  chains: NETWORK_CONFIG.chains,
  defaultChain: NETWORK_CONFIG.chains[0],
  projectId: "6bf24663c884a75f4af0ea6908187820",
  metadata: {
    name: PROJECT_CONFIG.name,
    description: PROJECT_CONFIG.description,
    url: PROJECT_CONFIG.url,
    icons: [`${PROJECT_CONFIG.url}/logo.svg`],
  },
};
