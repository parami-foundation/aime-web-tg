import React from "react";
import styles from "./style.less";
import { Button, ConfigProvider, theme } from "antd";
import { useModel } from "@umijs/max";
import { RiTwitterXFill, RiWalletLine } from "react-icons/ri";
import { THEME_CONFIG } from "@/constants/theme";
import ShareModal from "../shareModal";
import BuyModal from "../buyModal";
import { AIME_CONTRACT, DEBUG, PROJECT_CONFIG } from "@/constants/global";
import { useContractRead } from "wagmi";

export const ConnectWallet: React.FC = () => {
  const { telegramDataString, miniAppUtils, telegramWebApp } = useModel("useTelegram");
  const { setWalletModalVisible, accessToken } = useModel("useAccess");

  return (
    <div className={styles.infoCardContainer}>
      <p>
        👋 Hi, my friend it’s justinsuntron, let me take you on the path of wealth and freedom. Anyway, please <b>log in your web3 account</b> first.
      </p>
      <div className={styles.chatHeaderInfoButtons}>
        <Button
          block
          type="primary"
          size="large"
          className={styles.chatHeaderInfoButton}
          onClick={() => {
            !!telegramDataString ? miniAppUtils?.openLink(`${PROJECT_CONFIG?.url}/bridge?token=${accessToken}&action=bind#tgWebAppData=${encodeURIComponent(telegramDataString)}`) : setWalletModalVisible(true);
            !!telegramDataString && telegramWebApp?.close();
          }}
        >
          <RiWalletLine
            className={styles.chatHeaderInfoButtonIcon}
          />
          Connect Wallet
        </Button>
      </div>
    </div>
  )
};

export const ConnectTwitter: React.FC = () => {
  return (
    <div className={styles.infoCardContainer}>
      <p>
        👏 Excellent! So you are a senior Web3 user, <b>bind your Twitter account</b> to see if you can create your <b>AIME</b>.
      </p>
      <div className={styles.chatHeaderInfoButtons}>
        <Button
          block
          type="primary"
          size="large"
          className={styles.chatHeaderInfoButton}
          onClick={() => {
          }}
        >
          <RiTwitterXFill
            className={styles.chatHeaderInfoButtonIcon}
          />
          Login with Twitter
        </Button>
      </div>
    </div>
  )
};

export const BuyPower: React.FC = () => {
  const { accessToken } = useModel("useAccess");
  const { telegramDataString, miniAppUtils, telegramWebApp } = useModel("useTelegram");
  const { character } = useModel("useSetting");

  const [isBuyModalVisible, setIsBuyModalVisible] = React.useState<boolean>(false);
  const [transactionHash, setTransactionHash] = React.useState<`0x${string}` | undefined>();

  return (
    <>
      <div className={styles.infoCardContainer}>
        <p>
          😁 Nice To See You Eddie!<br />
          It looks like you're a <b>potential KOL</b>, You can <b>buy one of my AIME Power</b>, When the time is right, I will recommend you to generate your AIME.
        </p>
        <div className={styles.chatHeaderInfoButtons}>
          <ConfigProvider
            theme={{
              algorithm: theme.defaultAlgorithm,
              token: {
                wireframe: false,
                colorPrimary: THEME_CONFIG.colorSecondary,
                borderRadius: THEME_CONFIG.borderRadius,
                boxShadow: THEME_CONFIG.boxShadow,
              },
            }}
          >
            <Button
              block
              type="primary"
              size="large"
              className={styles.chatHeaderInfoButtonDark}
              onClick={() => {
                !!telegramDataString ? miniAppUtils?.openLink(`${PROJECT_CONFIG?.url}/bridge?token=${accessToken}&action=buypower&characterId=${character?.id}#tgWebAppData=${encodeURIComponent(telegramDataString)}`) : setIsBuyModalVisible(true);
                !!telegramDataString && telegramWebApp?.close();
              }}
            >
              Buy AIME Power
            </Button>
          </ConfigProvider>
        </div>
      </div>
      <BuyModal
        visible={isBuyModalVisible}
        setVisible={setIsBuyModalVisible}
        transactionHash={transactionHash}
        setTransactionHash={setTransactionHash}
      />
    </>
  )
};

export const Share: React.FC = () => {
  const [shareModalVisible, setShareModalVisible] = React.useState<boolean>(false);

  return (
    <>
      <div className={styles.infoCardContainer}>
        <p>
          👍 Good job! You have already acquired my AI share. Without a doubt, you are already the vanguard of this technological revolution. Now, don't hide it and boldly <b>share my AIME link</b> with the world, telling them it's synonymous with cool technology.
          <br />
          <br />
          <b>When they follow your footsteps and purchase my AI Power through your link</b>, you are not only a guide, but also a trendsetter. <span className={styles.italicOrange}>An additional <span className={styles.red}>5%</span> profit will be a reward for your wisdom.</span> Now, go out, exude confidence, share this future opportunity, let's work together to create miracles!
        </p>
        <div className={styles.chatHeaderInfoButtons}>
          <Button
            block
            type="primary"
            size="large"
            className={styles.chatHeaderInfoButton}
            onClick={() => {
              setShareModalVisible(true);
            }}
          >
            Share
          </Button>
        </div>
      </div>
      <ShareModal
        visible={shareModalVisible}
        setVisible={setShareModalVisible}
      />
    </>
  )
};

const InfoCard: React.FC = () => {
  const { address, twitterBinded } = useModel("useAccess");
  const { character } = useModel("useSetting");

  const [balance, setBalance] = React.useState<bigint>(0n);

  const { data }: {
    data?: bigint;
    isError: boolean;
    isLoading: boolean;
  } = useContractRead({
    address: DEBUG ? `0x${AIME_CONTRACT.Goerli.Powers}` : `0x${AIME_CONTRACT.Arbitrum.Powers}`,
    abi: require("@/abis/AIMePowers.json"),
    functionName: "powerBalance",
    args: [DEBUG ? `0x${character?.wallet?.goerli}` : `0x${character?.wallet?.arbitrum}`, address],
    onSuccess: (data) => {
      setBalance(data ?? 0n);
    }
  });

  if (!address && balance === 0n) {
    return (
      <ConnectWallet />
    )
  } else if (!!address && !twitterBinded && balance === 0n) {
    return (
      <ConnectTwitter />
    )
  } else if (!!address && twitterBinded && balance === 0n) {
    return (
      <BuyPower />
    )
  } else if (!!address && twitterBinded && balance > 0n) {
    return (
      <Share />
    )
  }
};

export default InfoCard;
