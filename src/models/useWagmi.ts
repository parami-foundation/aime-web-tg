import {
  Config,
  PublicClient,
  WebSocketPublicClient,
} from "wagmi";

import {
  NETWORK_CONFIG,
} from "@/constants/global";
import { useEffect, useState } from "react";
import { WALLETCONNECT_CONFIG } from "@/constants/walletconnect";
import { FallbackTransport, createPublicClient, http } from "viem";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

export default () => {
  const [wagmiConfig, setWagmiConfig] =
    useState<
      Config<
        PublicClient<FallbackTransport>,
        WebSocketPublicClient<FallbackTransport>
      > | null
    >(null);
  const [wagmiInitialized, setWagmiInitialized] = useState<boolean>(false);

  useEffect(() => setWagmiInitialized(true), []);

  useEffect(() => {
    console.log("Initializing Wagmi");
    const config = defaultWagmiConfig({
      chains: NETWORK_CONFIG.chains,
      projectId: WALLETCONNECT_CONFIG.projectId,
      metadata: WALLETCONNECT_CONFIG.metadata,
      enableInjected: true,
      enableEmail: false,
      enableEIP6963: false,
    });
    setWagmiConfig(config);

    createWeb3Modal({
      wagmiConfig: config,
      projectId: WALLETCONNECT_CONFIG.projectId,
      chains: NETWORK_CONFIG.chains,
      themeMode: 'light',
      themeVariables: {
        '--w3m-z-index': 9999999,
      },
    })
  }, []);

  const publicClient = createPublicClient({
    chain: NETWORK_CONFIG.chains[0],
    transport: http(),
  });

  return {
    wagmiConfig,
    publicClient,
    wagmiInitialized,
  };
};
