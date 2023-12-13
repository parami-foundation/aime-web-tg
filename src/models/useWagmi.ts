import {
  createConfig,
  configureChains,
  Config,
  PublicClient,
  WebSocketPublicClient,
} from "wagmi";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import {
  ALCHEMY_CONFIG,
  DEBUG,
  INFURA_CONFIG,
  NETWORK_CONFIG,
  PROJECT_CONFIG,
} from "@/constants/global";
import { useEffect, useState } from "react";
import { WALLETCONNECT_CONFIG } from "@/constants/walletconnect";
import { FallbackTransport, createPublicClient, http } from "viem";
import { EthereumClient } from "@web3modal/ethereum";
import { createWeb3Modal } from "@web3modal/wagmi/react";

export default () => {
  const [wagmiConfig, setWagmiConfig] =
    useState<
      Config<
        PublicClient<FallbackTransport>,
        WebSocketPublicClient<FallbackTransport>
      >
    >();
  const [ethereumClient, setEthereumClient] = useState<EthereumClient>();
  const [wagmiInitialized, setWagmiInitialized] = useState<boolean>(false);

  useEffect(() => setWagmiInitialized(true), []);

  useEffect(() => {
    console.log("Initializing Wagmi");
    const { chains, publicClient, webSocketPublicClient } = configureChains(
      NETWORK_CONFIG.chains,
      [
        alchemyProvider({
          apiKey: DEBUG ? ALCHEMY_CONFIG.Georli : ALCHEMY_CONFIG.Arbitrum,
        }),
        infuraProvider({ apiKey: INFURA_CONFIG.apiKey }),
        publicProvider(),
      ],
      {
        rank: true,
        batch: { multicall: true },
      }
    );

    const config = createConfig({
      autoConnect: true,
      connectors: [
        new MetaMaskConnector({
          chains,
          options: {
            UNSTABLE_shimOnConnectSelectAccount: true,
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
        new CoinbaseWalletConnector({
          chains,
          options: {
            appName: PROJECT_CONFIG.name,
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

    const ethClient = new EthereumClient(config, WALLETCONNECT_CONFIG.chains);
    setEthereumClient(ethClient);

    createWeb3Modal({
      wagmiConfig: config,
      projectId: WALLETCONNECT_CONFIG.projectId,
      chains,
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
    ethereumClient,
    publicClient,
    wagmiInitialized,
  };
};
