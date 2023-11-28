import React from "react";
import styles from "./style.less";
import { Button, ConfigProvider, theme } from "antd";
import { useModel } from "@umijs/max";
import { RiTwitterXFill, RiWalletLine } from "react-icons/ri";
import { THEME_CONFIG } from "@/constants/theme";
import ShareModal from "../shareModal";
import BuyModal from "../buyModal";

export const ConnectWallet: React.FC = () => {
  const { telegramDataString } = useModel("useTelegram");
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
            !!telegramDataString ? window.open(`https://aime-tg.parami.io/bridge?token=${accessToken}#tgWebAppData=${encodeURIComponent(telegramDataString)}`, "_blank") : setWalletModalVisible(true);
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
  const { telegramDataString } = useModel("useTelegram");

  const [isBuyModalVisible, setIsBuyModalVisible] = React.useState<boolean>(false);

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
                !!telegramDataString ? window.open(`https://aime-tg.parami.io/bridge?token=${accessToken}&action=buypower&aime=justinsuntron#tgWebAppData=${encodeURIComponent(telegramDataString)}`, "_blank") : setIsBuyModalVisible(true);
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
  const { address, signature, twitterBinded } = useModel("useAccess");

  if (!address) {
    return (
      <ConnectWallet />
    )
  } else if (!!address && !twitterBinded) {
    return (
      <ConnectTwitter />
    )
  } else if (!!address && twitterBinded) {
    return (
      <BuyPower />
    )
  } else {
    <Share />
  }
};

export default InfoCard;
