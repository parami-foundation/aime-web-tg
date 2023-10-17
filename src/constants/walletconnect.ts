import { goerli } from "wagmi/chains";
import { PROJECT_CONFIG } from "./global";

export const WALLETCONNECT_CONFIG = {
  chains: [goerli],
  defaultChain: goerli,
  projectId: "0c48e9b19e13e4a946164c9da070b744",
  metadata: {
    name: PROJECT_CONFIG.name,
    description: PROJECT_CONFIG.description,
    url: PROJECT_CONFIG.url,
    icons: [`${PROJECT_CONFIG.url}/logo.svg`],
  },
};
