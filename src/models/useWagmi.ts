import {
  Config,
  PublicClient,
  WebSocketPublicClient,
  configureChains,
  createConfig,
} from "wagmi";

import {
  ALCHEMY_CONFIG,
  INFURA_CONFIG,
  NETWORK_CONFIG,
} from "@/constants/global";
import { useEffect, useState } from "react";
import { WALLETCONNECT_CONFIG } from "@/constants/walletconnect";
import { FallbackTransport, createPublicClient, http } from "viem";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { walletConnectProvider } from "@web3modal/wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";

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

    const { publicClient, webSocketPublicClient } = configureChains(
      [...NETWORK_CONFIG.chains],
      [
        walletConnectProvider({
          projectId: WALLETCONNECT_CONFIG.projectId,
        }),
        alchemyProvider({
          apiKey: ALCHEMY_CONFIG.Optimism,
        }),
        infuraProvider({
          apiKey: INFURA_CONFIG.apiKey,
        }),
      ]
    )

    const config = createConfig({
      autoConnect: true,
      connectors: [
        new WalletConnectConnector({
          chains: NETWORK_CONFIG.chains,
          options: {
            projectId: WALLETCONNECT_CONFIG.projectId,
            showQrModal: false,
            metadata: WALLETCONNECT_CONFIG.metadata,
          }
        }),
        new InjectedConnector({
          chains: NETWORK_CONFIG.chains,
          options: {
            shimDisconnect: true,
          }
        }),
        new CoinbaseWalletConnector({
          chains: NETWORK_CONFIG.chains,
          options: {
            appName: WALLETCONNECT_CONFIG.metadata.name,
          }
        })
      ],
      publicClient,
      webSocketPublicClient,
    });

    setWagmiConfig(config);

    createWeb3Modal({
      wagmiConfig: config,
      projectId: WALLETCONNECT_CONFIG.projectId,
      chains: NETWORK_CONFIG.chains,
      defaultChain: NETWORK_CONFIG.chains[0],
      metadata: WALLETCONNECT_CONFIG.metadata,
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
