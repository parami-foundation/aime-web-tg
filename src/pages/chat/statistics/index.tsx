import React, { useEffect } from "react";
import styles from "./style.less";
import { Button, Image, message } from "antd";
import { useParams } from "@umijs/max";
import { charactersData } from "@/mocks/character";
import { FaAngleLeft, FaAngleRight, FaEthereum } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useModel, history } from "@umijs/max";
import { EXPLORER_CONFIG } from "@/constants/global";
import { IoShareSocialOutline } from "react-icons/io5";
import classNames from "classnames";
import ActivityItem from "./activityItem";
import HoldersItem from "./holdersItem";
import ShareModal from "../detail/shareModal";
import { AccessLayout } from "@/layouts/access";

const Statistics: React.FC = () => {
  const { accessToken } = useModel("useAccess");
  const { miniAppUtils, miniAppBackButton } = useModel("useTelegram");

  const [tab, setTab] = React.useState<string>("activity");
  const [shareModalVisible, setShareModalVisible] = React.useState<boolean>(false);

  const { id } = useParams<{
    id: string,
  }>();

  useEffect(() => {
    if (!!miniAppBackButton) {
      miniAppBackButton?.show();
      miniAppBackButton?.on('click', () => {
        history.push(`/chat/${id}`);
      });
    }
  }, [miniAppBackButton]);

  const character = !!id ? charactersData.get(id) : {};

  useEffect(() => {
    if (!accessToken || !charactersData.size || !id) {
      history.push("/");
      return;
    }
    if (!charactersData.get(id)) {
      history.push("/");
      message.error("Character not found");
      return;
    }
  }, [character, id]);

  return (
    <AccessLayout>
      <div className={styles.statisticsContainer}>
        <div className={styles.statisticsWrapper}>
          <div className={styles.statisticsHeader}>
            <div className={styles.statisticsHeaderButtons}>
              <div className={styles.statisticsHeaderLeft}>
                <div
                  className={styles.statisticsHeaderHome}
                  onClick={() => {
                    history.push(`/chat/${id}`);
                  }}
                >
                  <FaAngleLeft
                    className={styles.statisticsHeaderHomeIcon}
                  />
                  <span>Back</span>
                </div>
              </div>
              <div className={styles.statisticsHeaderRight}>
                <div
                  className={styles.statisticsHeaderButton}
                  onClick={() => {
                    setShareModalVisible(true);
                  }}
                >
                  <IoShareSocialOutline />
                </div>
              </div>
            </div>
            <div className={styles.statisticsAvatarContainer}>
              <div className={styles.statisticsAvatar}>
                <Image
                  className={styles.statisticsAvatarImg}
                  src={character?.avatar_url}
                  fallback={require('@/assets/me/avatar.png')}
                  preview={false}
                />
              </div>
              <div className={styles.statisticsAvatarTokenCount}>
                <FaEthereum
                  className={styles.statisticsAvatarTokenCountIcon}
                />
                <span>{character?.value?.toFixed(2)}</span>
              </div>
            </div>
            <div className={styles.statisticsName}>
              {character?.name}
              <span className={styles.statisticsTag}>
                #289
              </span>
            </div>
            <div className={styles.statisticsDescription}>
              Guess what, I'm a very funny guy.
            </div>
            <Button
              type="primary"
              shape="round"
              size="large"
              icon={<FaXTwitter />}
              className={styles.twitterButton}
              onClick={() => {
                (!!miniAppUtils) ? miniAppUtils?.openLink(`https://twitter.com/${character?.twitter?.id}`) : window.open(`https://twitter.com/${character?.twitter?.id}`);
              }}
            >
              @{character?.twitter?.id}
              <VscVerifiedFilled
                className={styles.twitterButtonVerified}
              />
            </Button>
            <div
              className={styles.statisticsTokenAddress}
              onClick={() => {
                (!!miniAppUtils) ? miniAppUtils?.openLink(`${EXPLORER_CONFIG?.Optimism}/address/${character?.wallet?.optimism}`) : window.open(`${EXPLORER_CONFIG?.Optimism}/address/${character?.wallet?.optimism}`);
              }}
            >
              <div className={styles.statisticsTokenAddressLeft}>
                Token Address:
                <span>
                  0x{character?.wallet?.optimism?.slice(2, 8)}...{character?.wallet?.optimism?.slice(-4)}
                </span>
              </div>
              <div className={styles.statisticsTokenAddressRight}>
                <FaAngleRight
                  className={styles.statisticsTokenAddressRightIcon}
                />
              </div>
            </div>
          </div>
          <div className={styles.statisticsContent}>
            <div className={styles.statisticsContentTabs}>
              <div
                className={classNames(styles.statisticsContentTab, tab === 'activity' && styles.statisticsContentTabActive)}
                onClick={() => setTab('activity')}
              >
                <span>Activity</span>
              </div>
              <div
                className={classNames(styles.statisticsContentTab, tab === 'holders' && styles.statisticsContentTabActive)}
                onClick={() => setTab('holders')}
              >
                <span>Holders</span>
              </div>
            </div>
            <div className={styles.statisticsContentList}>
              {tab === 'activity' && (
                <ActivityItem
                  character={character}
                />
              )}
              {tab === 'holders' && (
                <HoldersItem />
              )}
            </div>
          </div>
        </div>
        <ShareModal
          visible={shareModalVisible}
          setVisible={setShareModalVisible}
        />
      </div>
    </AccessLayout>
  )
};

export default Statistics;
