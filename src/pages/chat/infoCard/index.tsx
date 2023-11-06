import React, { useEffect } from "react";
import styles from "./style.less";
import { Button, ConfigProvider, theme } from "antd";
import { useModel } from "@umijs/max";
import { RiTwitterXFill, RiWalletLine } from "react-icons/ri";
import { THEME_CONFIG } from "@/constants/theme";
import BuyModal from "../buyModal";
import { useMainButton, useSDK } from "@tma.js/sdk-react";

const ConnectWallet: React.FC = () => {
  const { setWalletModalOpen } = useModel("useAccess");

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
            setWalletModalOpen(true);
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

const ConnectTwitter: React.FC = () => {
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

const BuyPower: React.FC = () => {
  const [buyModalVisible, setBuyModalVisible] = React.useState<boolean>(false);

  const { components, error } = useSDK();

  if (!error && !!components) {
    const mainButton = useMainButton();

    useEffect(() => {
      mainButton?.setText('Buy AIME Power');
      mainButton?.enable().show();
      mainButton?.on('click', () => {
        setBuyModalVisible(true);
      });

      return () => {
        mainButton?.hide();
        mainButton?.hideProgress();
        mainButton?.off('click', () => {
          setBuyModalVisible(false);
        });
      };
    }, [mainButton]);
  }

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
                setBuyModalVisible(true);
              }}
            >
              Buy AIME Power
            </Button>
          </ConfigProvider>
        </div>
      </div>
      <BuyModal
        visible={buyModalVisible}
        setVisible={setBuyModalVisible}
      />
    </>
  )
};

const InfoCard: React.FC = () => {
  const { accessToken, twitterBinded } = useModel("useAccess");

  if (!accessToken) {
    return (
      <ConnectWallet />
    )
  } else if (!!accessToken && !twitterBinded) {
    return (
      <ConnectTwitter />
    )
  } else if (!!accessToken && twitterBinded) {
    return (
      <BuyPower />
    )
  } else {
    <></>
  }
};

export default InfoCard;
