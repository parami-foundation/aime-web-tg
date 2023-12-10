import React, { createRef } from "react";
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
import { MessageDisplay } from "@/models/useChat";
import { v4 as uuidv4 } from 'uuid';

const AiPop: React.FC<{
  data?: MessageDisplay[];
}> = ({ data }) => {
  const { telegramDataString, miniAppUtils, telegramWebApp, telegramAuthType } = useModel("useTelegram");
  const { accessToken, accessTokenExpire } = useModel("useAccess");
  const { setWalletModalVisible } = useModel("useWallet");
  const { character } = useModel("useSetting");

  const [isBuyModalVisible, setIsBuyModalVisible] = React.useState<boolean>(false);
  const [shareModalVisible, setShareModalVisible] = React.useState<boolean>(false);
  const [transactionHash, setTransactionHash] = React.useState<`0x${string}` | undefined>();
  const [action, setAction] = React.useState<string>("default");

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
        {data?.map((item: MessageDisplay) => {
          !!item?.action && setAction(item?.action);
          switch (item?.type) {
            case "message":
              switch (item?.action) {
                case "connectWallet":
                  return (
                    <div
                      className={styles.aiPopAction}
                      key={item?.id}
                    >
                      <MDEditor.Markdown
                        source={item?.data as string}
                        style={{
                          backgroundColor: 'transparent',
                        }}
                        className={styles.aiPopText}
                      />
                      <div
                        className={styles.aiPopButtons}
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
                    <div
                      className={styles.aiPopAction}
                      key={item?.id}
                    >
                      <MDEditor.Markdown
                        source={item?.data as string}
                        style={{
                          backgroundColor: 'transparent',
                        }}
                        className={styles.aiPopText}
                      />
                      <div className={styles.aiPopButtons}>
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
                    <React.Fragment
                      key={item?.id}
                    >
                      <div className={styles.aiPopAction}>
                        <MDEditor.Markdown
                          source={item?.data as string}
                          style={{
                            backgroundColor: 'transparent',
                          }}
                          className={styles.aiPopText}
                        />
                        <div
                          className={styles.aiPopButtons}
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
                    </React.Fragment>
                  )
                case "shareLink":
                  return (
                    <React.Fragment
                      key={item?.id}
                    >
                      <div className={styles.aiPopAction}>
                        <MDEditor.Markdown
                          source={item?.data as string}
                          style={{
                            backgroundColor: 'transparent',
                          }}
                          className={styles.aiPopText}
                        />
                        <div className={styles.aiPopButtons}>
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
                    </React.Fragment>
                  )
                default:
                  return (
                    <MDEditor.Markdown
                      key={item?.id}
                      source={item?.data as string}
                      style={{
                        backgroundColor: 'transparent',
                      }}
                      className={styles.aiPopText}
                    />
                  )
              }
            case "data":
              return (
                <div
                  className={styles.aiPopAudio}
                  key={item?.id}
                >
                  <SoundPlayIcon />
                  <audio
                    className={styles.aiPopAudioPlayer}
                    src={URL.createObjectURL(new Blob([item?.data as Uint8Array], { type: "audio/mp3" }))}
                    ref={audioPlayer}
                  >
                    <source
                      src={URL.createObjectURL(new Blob([item?.data as Uint8Array], { type: "audio/mp3" }))}
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
