import React, { useEffect, useRef } from "react";
import styles from "./style.less";
import { BsSoundwave } from "react-icons/bs";
import { notification } from "antd";
import { DEBUG } from "@/constants/global";

const AiPop: React.FC<{
  type?: string;
  data?: any;
}> = ({ type, data }) => {
  const [audioDuration, setAudioDuration] = React.useState<number>();

  const audioPlayer = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    (async () => {
      audioPlayer?.current?.addEventListener("loadedmetadata", () => {
        var duration = audioPlayer?.current?.duration;
        setAudioDuration(duration);
      });
    })();
  }, []);

  return (
    <>
      {type === "message" && (
        <div className={styles.aiPopContainer}>
          <div className={styles.aiPopWrapper}>
            {data}
          </div>
        </div>
      )}
      {type === "data" && (
        <div
          className={styles.aiPopContainer}
          onClick={() => {
            audioPlayer?.current?.play();
          }}
        >
          <div className={styles.aiPopWrapper}>
            <div className={styles.audioMsg}>
              <div className={styles.audioMsgTime}>
                {audioDuration && `${audioDuration.toFixed(2)}`}''
              </div>
              <BsSoundwave
                className={styles.audioMsgIcon}
              />
              <audio
                className={styles.audioMsgPlayer}
                src={URL.createObjectURL(new Blob([data], { type: "audio/mp3" }))}
                ref={audioPlayer}
              >
                <source
                  src={URL.createObjectURL(new Blob([data], { type: "audio/mp3" }))}
                  type="audio/mp3"
                />
              </audio>
            </div>
          </div>
        </div>
      )}
    </>
  )
};

export default AiPop;
