import { goerli } from "wagmi/chains";
import {
  createConfig,
  configureChains,
  Config,
  PublicClient,
  WebSocketPublicClient,
} from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { ALCHEMY_CONFIG, PROJECT_CONFIG } from "@/constants/global";
import { useEffect, useState } from "react";
import { WALLETCONNECT_CONFIG } from "@/constants/walletconnect";
import { FallbackTransport } from "viem";

export default () => {
  const [wagmiConfig, setWagmiConfig] =
    useState<
      Config<
        PublicClient<FallbackTransport>,
        WebSocketPublicClient<FallbackTransport>
      >
    >();

  useEffect(() => {
    const { chains, publicClient, webSocketPublicClient } = configureChains(
      [goerli],
      [alchemyProvider({ apiKey: ALCHEMY_CONFIG.Georli }), publicProvider()]
    );

    const config = createConfig({
      autoConnect: true,
      connectors: [
        new MetaMaskConnector({ chains }),
        new CoinbaseWalletConnector({
          chains,
          options: {
            appName: PROJECT_CONFIG.name,
          },
        }),
        new WalletConnectConnector({
          chains,
          options: {
            projectId: WALLETCONNECT_CONFIG.projectId,
            metadata: WALLETCONNECT_CONFIG.metadata,
            qrModalOptions: {
              themeVariables: {
                "--wcm-z-index": "9999999",
              },
            },
          },
        }),
        new InjectedConnector({
          chains,
          options: {
            name: "Injected",
            shimDisconnect: true,
          },
        }),
      ],
      publicClient,
      webSocketPublicClient,
    });

    setWagmiConfig(config);
  }, []);

  return {
    wagmiConfig,
  };
};
