import React, { createRef, useRef } from "react";
import styles from "./style.less";
import { Button, ConfigProvider, theme } from "antd";
import { PROJECT_CONFIG } from "@/constants/global";
import { RiTwitterXFill, RiWalletLine } from "react-icons/ri";
import { useModel } from "@umijs/max";
import classNames from "classnames";
import { THEME_CONFIG } from "@/constants/theme";
import BuyModal from "../../buyModal";
import ShareModal from "../../shareModal";
import { ReactComponent as SoundPlayIcon } from '@/assets/icon/soundPlay.svg';
import { MessageDisplay } from "@/models/useChat";
import ReactMarkdown from "react-markdown";

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

  const audioPlayer = createRef<HTMLAudioElement>();
  const wrapperRef = useRef<HTMLDivElement>(null);

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
      <div
        className={classNames(styles.aiPopWrapper)}
        ref={wrapperRef}
      >
        {data?.map((item: MessageDisplay) => {
          !!item?.action && wrapperRef?.current?.classList?.add(styles.aiPopWrapperFull);
          switch (item?.type) {
            case "message":
              switch (item?.action) {
                case "connectWallet":
                  return (
                    <div
                      className={styles.aiPopAction}
                      key={item?.id}
                    >
                      <ReactMarkdown
                        className={styles.aiPopText}
                        components={{
                          a: (props) => (
                            <a
                              onClick={(e) => {
                                (!!telegramDataString && !!telegramWebApp && !!props?.href) ? miniAppUtils?.openLink(props?.href) : window.open(props?.href, "_blank");
                              }}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.aiPopLink}
                            >
                              🔗 {props.children}
                            </a>
                          ),
                        }}
                      >
                        {item?.data as string}
                      </ReactMarkdown>
                      <div
                        className={styles.aiPopButtons}
                      >
                        <Button
                          block
                          type="primary"
                          size="large"
                          className={styles.aiPopButton}
                          onClick={() => {
                            (!!telegramDataString && !!telegramWebApp) ? miniAppUtils?.openLink(`${PROJECT_CONFIG?.url}/bridge?access_token=${accessToken}&access_token_expire=${accessTokenExpire}&action=bind&characterId=${character?.id}&telegramDataString=${encodeURIComponent(telegramDataString)}`) : setIsBuyModalVisible(true);
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
                      <ReactMarkdown
                        className={styles.aiPopText}
                        components={{
                          a: (props) => (
                            <a
                              onClick={(e) => {
                                (!!telegramDataString && !!telegramWebApp && !!props?.href) ? miniAppUtils?.openLink(props?.href) : window.open(props?.href, "_blank");
                              }}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.aiPopLink}
                            >
                              🔗 {props.children}
                            </a>
                          ),
                        }}
                      >
                        {item?.data as string}
                      </ReactMarkdown>
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
                        <ReactMarkdown
                          className={styles.aiPopText}
                          components={{
                            a: (props) => (
                              <a
                                onClick={(e) => {
                                  (!!telegramDataString && !!telegramWebApp && !!props?.href) ? miniAppUtils?.openLink(props?.href) : window.open(props?.href, "_blank");
                                }}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.aiPopLink}
                              >
                                🔗 {props.children}
                              </a>
                            ),
                          }}
                        >
                          {item?.data as string}
                        </ReactMarkdown>
                        <div className={styles.aiPopButtons}>
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
                                (!!telegramDataString && !!telegramWebApp) ? miniAppUtils?.openLink(`${PROJECT_CONFIG?.url}/bridge?access_token=${accessToken}&access_token_expire=${accessTokenExpire}&action=buypower&characterId=${character?.id}&telegramDataString=${encodeURIComponent(telegramDataString)}`) : setIsBuyModalVisible(true);
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
                        <ReactMarkdown
                          className={styles.aiPopText}
                          components={{
                            a: (props) => (
                              <a
                                onClick={(e) => {
                                  (!!telegramDataString && !!telegramWebApp && !!props?.href) ? miniAppUtils?.openLink(props?.href) : window.open(props?.href, "_blank");
                                }}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.aiPopLink}
                              >
                                🔗 {props.children}
                              </a>
                            ),
                          }}
                        >
                          {item?.data as string}
                        </ReactMarkdown>
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
                    <ReactMarkdown
                      key={item?.id}
                      className={styles.aiPopText}
                      components={{
                        a: (props) => (
                          <a
                            onClick={(e) => {
                              (!!telegramDataString && !!telegramWebApp && !!props?.href) ? miniAppUtils?.openLink(props?.href) : window.open(props?.href, "_blank");
                            }}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.aiPopLink}
                          >
                            🔗 {props.children}
                          </a>
                        ),
                      }}
                    >
                      {item?.data as string}
                    </ReactMarkdown>
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
