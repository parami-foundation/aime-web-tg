import React from "react";
import styles from "./style.less";
import { AccessLayout } from "@/layouts/access";
import NavBar from "@/components/navBar";
import { ReactComponent as AvatarCircle } from '@/assets/me/circle.svg';
import { FaEthereum } from "react-icons/fa";
import { PiCopySimple } from "react-icons/pi";
import { ReactComponent as FirstIcon } from '@/assets/icon/1st.svg';
import { BiChevronRight } from "react-icons/bi";
import Airdrop from "./airdrop";

const Me: React.FC = () => {
  const [airdropVisible, setAirdropVisible] = React.useState<boolean>(false);

  return (
    <AccessLayout>
      <div className={styles.meContainer}>
        <div className={styles.meWrapper}>
          <div className={styles.meAvatar}>
            <div className={styles.meAvatarWrapper}>
              <AvatarCircle
                className={styles.meAvatarCircle}
              />
              <div className={styles.meAvatarCirclePoint}>
                <div className={styles.meAvatarCirclePointWrapper} />
              </div>
              <img
                className={styles.meAvatarImage}
                src="https://media.licdn.com/dms/image/C5103AQEjthnHx0FTLQ/profile-displayphoto-shrink_800_800/0/1536214237739?e=2147483647&v=beta&t=Th9UXbvF5Rc9oF6E-C4HFotvCZQbDj-AH5BVN2wtWbw"
                alt="avatar"
              />
              <div className={styles.meAvatarToken}>
                <FaEthereum
                  className={styles.meAvatarTokenIcon}
                />
                <span>3.655</span>
              </div>
            </div>
            <div className={styles.meAvatarPop}>
              <div className={styles.meAvatarPopWrapper}>
                👋 Hi, Nana
              </div>
            </div>
          </div>
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
                  3.654805 ETH
                </div>
                <div className={styles.meBalanceContentFlat}>
                  $6547.663775
                </div>
              </div>
            </div>
            <div className={styles.meBalanceAddress}>
              <div className={styles.meBalanceAddressTitle}>
                My Wallet:
              </div>
              <div className={styles.meBalanceAddressContent}>
                <span>084a08...17a9C</span>
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
