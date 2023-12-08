import React, { createRef, useEffect } from "react";
import styles from "./style.less";
import { Button, ConfigProvider, theme } from "antd";
import { PROJECT_CONFIG } from "@/constants/global";
import { RiTwitterXFill, RiWalletLine } from "react-icons/ri";
import { useModel } from "@umijs/max";
import classNames from "classnames";
import { THEME_CONFIG } from "@/constants/theme";
import BuyModal from "../../buyModal";
import ShareModal from "../../shareModal";
import MDEditor from '@uiw/react-md-editor';
import { ReactComponent as SoundPlayIcon } from '@/assets/icon/soundPlay.svg';

const AiPop: React.FC<{
  action?: string;
  data?: any;
}> = ({ action, data }) => {
  const { telegramDataString, miniAppUtils, telegramWebApp, telegramAuthType } = useModel("useTelegram");
  const { accessToken, accessTokenExpire } = useModel("useAccess");
  const { setWalletModalVisible } = useModel("useWallet");
  const { character } = useModel("useSetting");

  const [isBuyModalVisible, setIsBuyModalVisible] = React.useState<boolean>(false);
  const [shareModalVisible, setShareModalVisible] = React.useState<boolean>(false);
  const [transactionHash, setTransactionHash] = React.useState<`0x${string}` | undefined>();

  const audioPlayer = createRef<HTMLAudioElement>();

  return (
    <div
      className={styles.aiPopContainer}
      onClick={() => {
        if (!!audioPlayer?.current && audioPlayer?.current?.paused) {
          audioPlayer?.current?.play();
        } else {
          audioPlayer?.current?.pause();
        }
      }}
    >
      <div className={classNames(styles.aiPopWrapper, action !== "default" && styles.aiPopWrapperFull)}>
        {data?.map((item: any, index: number) => {
          switch (item?.type) {
            case "message":
              switch (action) {
                case "default":
                  return (
                    <MDEditor.Markdown
                      key={index}
                      source={item?.data}
                      style={{
                        backgroundColor: 'transparent',
                      }}
                      className={styles.aiPopText}
                    />
                  )
                case "connectWallet":
                  return (
                    <div className={styles.aiPopAction}>
                      <MDEditor.Markdown
                        key={index}
                        source={item?.data}
                        style={{
                          backgroundColor: 'transparent',
                        }}
                        className={styles.aiPopText}
                      />
                      <div
                        className={styles.aiPopButtons}
                        key={index}
                      >
                        <Button
                          block
                          type="primary"
                          size="large"
                          className={styles.aiPopButton}
                          onClick={() => {
                            (!!telegramDataString && !!telegramWebApp) ? miniAppUtils?.openLink(`${PROJECT_CONFIG?.url}/bridge?access_token=${accessToken}&access_token_expire=${accessTokenExpire}&action=bind&telegramDataString=${encodeURIComponent(telegramDataString)}`) : setWalletModalVisible(true);
                            (!!telegramDataString && !!telegramWebApp) && telegramWebApp?.close();
                          }}
                        >
                          <RiWalletLine
                            className={styles.aiPopButtonIcon}
                          />
                          Connect Wallet
                        </Button>
                      </div>
                    </div>
                  )
                case "connectTwitter":
                  return (
                    <div className={styles.aiPopAction}>
                      <MDEditor.Markdown
                        key={index}
                        source={item?.data}
                        style={{
                          backgroundColor: 'transparent',
                        }}
                        className={styles.aiPopText}
                      />
                      <div
                        className={styles.aiPopButtons}
                        key={index}
                      >
                        <Button
                          block
                          type="primary"
                          size="large"
                          className={styles.aiPopButton}
                          onClick={() => {
                          }}
                        >
                          <RiTwitterXFill
                            className={styles.aiPopButtonIcon}
                          />
                          Login with Twitter
                        </Button>
                      </div>
                    </div>
                  )
                case "buyPower":
                  return (
                    <>
                      <div className={styles.aiPopAction}>
                        <MDEditor.Markdown
                          key={index}
                          source={item?.data}
                          style={{
                            backgroundColor: 'transparent',
                          }}
                          className={styles.aiPopText}
                        />
                        <div
                          className={styles.aiPopButtons}
                          key={index}
                        >
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
                              className={styles.aiPopButtonDark}
                              onClick={() => {
                                (!!telegramDataString && !!telegramWebApp) ? miniAppUtils?.openLink(`${PROJECT_CONFIG?.url}/bridge?access_token=${accessToken}&access_token_expire=${accessTokenExpire}&action=buypower&characterId=${character?.id}&telegramAuthType=${telegramAuthType}&telegramDataString=${encodeURIComponent(telegramDataString)}`) : setIsBuyModalVisible(true);
                                (!!telegramDataString && !!telegramWebApp) && telegramWebApp?.close();
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
                case "shareLink":
                  return (
                    <>
                      <div className={styles.aiPopAction}>
                        <MDEditor.Markdown
                          key={index}
                          source={item?.data}
                          style={{
                            backgroundColor: 'transparent',
                          }}
                          className={styles.aiPopText}
                        />
                        <div
                          className={styles.aiPopButtons}
                          key={index}
                        >
                          <Button
                            block
                            type="primary"
                            size="large"
                            className={styles.aiPopButton}
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
              }
            case "data":
              return (
                <div
                  className={styles.aiPopAudio}
                  key={index}
                >
                  <SoundPlayIcon />
                  <audio
                    className={styles.aiPopAudioPlayer}
                    src={URL.createObjectURL(new Blob([item?.data], { type: "audio/mp3" }))}
                    ref={audioPlayer}
                  >
                    <source
                      src={URL.createObjectURL(new Blob([item?.data], { type: "audio/mp3" }))}
                      type="audio/mp3"
                    />
                  </audio>
                </div>
              )
          }
        })}
      </div>
    </div>
  )
};

export default AiPop;
