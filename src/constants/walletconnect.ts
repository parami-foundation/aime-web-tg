import { NETWORK_CONFIG, PROJECT_CONFIG } from "./global";

export const WALLETCONNECT_CONFIG = {
  chains: NETWORK_CONFIG.chains,
  defaultChain: NETWORK_CONFIG.chains[0],
  projectId: "2e586b0807500a0da3a4f7b66418295e",
  metadata: {
    name: PROJECT_CONFIG.name,
    description: PROJECT_CONFIG.description,
    url: PROJECT_CONFIG.url,
    icons: [`${PROJECT_CONFIG.url}/logo.svg`],
  },
};
