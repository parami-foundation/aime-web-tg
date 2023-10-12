import { goerli } from "wagmi/chains";
import { PROJECT_CONFIG } from "./global";

export const WALLETCONNECT_CONFIG = {
  chains: [goerli],
  defaultChain: goerli,
  projectId: "85e5fffcdae8e1d8dc7149ca1ec5562f",
  metadata: {
    name: PROJECT_CONFIG.name,
    description: PROJECT_CONFIG.description,
    url: PROJECT_CONFIG.url,
    icons: [`${PROJECT_CONFIG.url}/logo.svg`],
  },
};
