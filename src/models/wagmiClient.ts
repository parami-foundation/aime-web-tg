import { WALLETCONNECT_CONFIG } from "@/constants/walletconnect";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { useEffect, useState } from "react";
import { FallbackTransport } from "viem";
import {
  Config,
  PublicClient,
  WebSocketPublicClient,
  configureChains,
  createConfig,
} from "wagmi";

export default () => {
  const [wagmiConfig, setWagmiConfig] =
    useState<Config<PublicClient<FallbackTransport>, WebSocketPublicClient>>();
  const [ethereumClient, setEthereumClient] = useState<EthereumClient>();
  const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const { publicClient } = configureChains(WALLETCONNECT_CONFIG.chains, [
      w3mProvider({ projectId: WALLETCONNECT_CONFIG.projectId }),
    ]);
    const wgConfig = createConfig({
      autoConnect: true,
      connectors: w3mConnectors({
        projectId: WALLETCONNECT_CONFIG.projectId,
        chains: WALLETCONNECT_CONFIG.chains,
      }),
      publicClient,
    });
    setWagmiConfig(wgConfig);
    const ethClient = new EthereumClient(wgConfig, WALLETCONNECT_CONFIG.chains);
    setEthereumClient(ethClient);
  }, []);

  return {
    wagmiConfig,
    ethereumClient,
    walletModalOpen,
    setWalletModalOpen,
  };
};
