import React, { useEffect } from "react";
import styles from "./style.less";
import { AccessLayout } from "@/layouts/access";
import NavBar from "@/components/navBar";
import { PiCopySimple } from "react-icons/pi";
import { ReactComponent as FirstIcon } from '@/assets/icon/1st.svg';
import { BiChevronRight } from "react-icons/bi";
import Airdrop from "./airdrop";
import AvatarRegistered from "./registered";
import AvatarNew from "./new";
import { useBalance } from "wagmi";
import { useModel } from "@umijs/max";
import { GetTokenPrice } from "@/services/third";
import { formatEther } from "viem";
import { message } from "antd";

const Me: React.FC = () => {
  const { address } = useModel("useWallet");

  const [airdropVisible, setAirdropVisible] = React.useState<boolean>(false);
  const [tokenPrice, setTokenPrice] = React.useState<number>(0);

  const { data: balance, isError: balanceError, isLoading: balanceLoading } = useBalance({
    address: address,
  });

  useEffect(() => {
    GetTokenPrice({
      token: "ethereum",
      currency: "usd",
    }).then(({ response, data }) => {
      if (response?.status === 200) {
        setTokenPrice(data?.ethereum?.usd);
      }
    });
  }, []);

  return (
    <AccessLayout>
      <div className={styles.meContainer}>
        <div className={styles.meWrapper}>
          <AvatarNew />
          <div className={styles.meInfo}>
            <div className={styles.meInfoAvatar}>
              <img
                className={styles.meInfoAvatarImage}
                src="https://media.licdn.com/dms/image/C5103AQEjthnHx0FTLQ/profile-displayphoto-shrink_800_800/0/1536214237739?e=2147483647&v=beta&t=Th9UXbvF5Rc9oF6E-C4HFotvCZQbDj-AH5BVN2wtWbw"
                alt="avatar"
              />
              <div className={styles.meInfoAvatarBadge}>
                <FirstIcon
                  className={styles.meInfoAvatarBadgeIcon}
                />
              </div>
            </div>
            <div className={styles.meInfoText}>
              <div className={styles.meInfoTextName}>
                Nana
              </div>
              <div className={styles.meInfoTextDesc}>
                Find something difference.
              </div>
            </div>
          </div>
          <div className={styles.meBalance}>
            <div className={styles.meBalanceTitle}>
              Current Balance:
            </div>
            <div className={styles.meBalanceContent}>
              <img
                className={styles.meBalanceContentIcon}
                src={require('@/assets/me/eth.png')}
                alt="eth"
              />
              <div className={styles.meBalanceContentRight}>
                <div className={styles.meBalanceContentValue}>
                  {balanceLoading ?? balanceError ? (
                    <span>0.00 ETH</span>
                  ) : (
                    <span>{Number(balance?.formatted).toFixed(6)} {balance?.symbol}</span>
                  )}
                </div>
                <div className={styles.meBalanceContentFlat}>
                  ${!!balance?.value && (Number(formatEther(balance?.value)) * tokenPrice).toFixed(6)}
                </div>
              </div>
            </div>
            <div className={styles.meBalanceAddress}>
              <div className={styles.meBalanceAddressTitle}>
                My Wallet:
              </div>
              <div
                className={styles.meBalanceAddressContent}
                onClick={() => {
                  !!address && navigator.clipboard.writeText(address);
                  message.success("Copied");
                }}
              >
                <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                <PiCopySimple
                  className={styles.meBalanceAddressContentIcon}
                />
              </div>
            </div>
          </div>
          <div className={styles.meBalanceButtons}>
            <div
              className={styles.meBalanceButtonsButton}
              onClick={() => setAirdropVisible(true)}
            >
              <div className={styles.meBalanceButtonsButtonLeft}>
                <div className={styles.meBalanceButtonsButtonLeftIcon}>
                  <img
                    className={styles.meBalanceButtonsButtonLeftIconImage}
                    src={require('@/assets/me/airdrop.png')}
                    alt="airdrop"
                  />
                </div>
                <div className={styles.meBalanceButtonsButtonLeftText}>
                  <div className={styles.meBalanceButtonsButtonLeftTextTitle}>
                    Airdrop
                  </div>
                  <div className={styles.meBalanceButtonsButtonLeftTextDesc}>
                    A place full of surprises
                  </div>
                </div>
              </div>
              <div className={styles.meBalanceButtonsButtonRight}>
                <BiChevronRight
                  className={styles.meBalanceButtonsButtonRightIcon}
                />
              </div>
            </div>
          </div>
        </div>
        <NavBar />
      </div>
      <Airdrop
        visible={airdropVisible}
        setVisible={setAirdropVisible}
      />
    </AccessLayout>
  )
};

export default Me;
