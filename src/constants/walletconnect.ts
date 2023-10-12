import { goerli } from "wagmi/chains";
import { PROJECT_CONFIG } from "./global";

export const WALLETCONNECT_CONFIG = {
  chains: [goerli],
  projectId: "2e586b0807500a0da3a4f7b66418295e",
  metadata: {
    name: PROJECT_CONFIG.name,
    description: PROJECT_CONFIG.description,
    url: PROJECT_CONFIG.url,
    icons: [`${PROJECT_CONFIG.url}/logo.svg`],
  },
};
