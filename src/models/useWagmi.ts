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
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { walletConnectProvider, EIP6963Connector } from "@web3modal/wagmi";
import {
  ALCHEMY_CONFIG,
  INFURA_CONFIG,
  NETWORK_CONFIG,
  PROJECT_CONFIG,
} from "@/constants/global";
import { useEffect, useState } from "react";
import { WALLETCONNECT_CONFIG } from "@/constants/walletconnect";
import { FallbackTransport, createPublicClient, http } from "viem";
import { EthereumClient } from "@web3modal/ethereum";
import { infuraProvider } from "wagmi/providers/infura";
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

  useEffect(() => {
    const { chains, publicClient, webSocketPublicClient } = configureChains(
      NETWORK_CONFIG.chains,
      [
        walletConnectProvider({ projectId: WALLETCONNECT_CONFIG.projectId }),
        infuraProvider({ apiKey: INFURA_CONFIG.apiKey }),
        alchemyProvider({ apiKey: ALCHEMY_CONFIG.Georli }),
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
        new EIP6963Connector({ chains }),
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
        new MetaMaskConnector({ chains }),
        new CoinbaseWalletConnector({
          chains,
          options: {
            appName: PROJECT_CONFIG.name,
          },
        }),
      ],
      publicClient,
      webSocketPublicClient,
    });

    createWeb3Modal({
      wagmiConfig: config,
      projectId: WALLETCONNECT_CONFIG.projectId,
      chains,
    });

    const ethClient = new EthereumClient(config, WALLETCONNECT_CONFIG.chains);
    setEthereumClient(ethClient);

    setWagmiConfig(config);
  }, []);

  const publicClient = createPublicClient({
    chain: NETWORK_CONFIG.chains[0],
    transport: http(),
  });

  return {
    wagmiConfig,
    ethereumClient,
    publicClient,
  };
};
