import React, { useEffect, useRef } from "react";
import styles from "./style.less";
import { BsSoundwave } from "react-icons/bs";

const AiPop: React.FC<{
  data?: any;
}> = ({ data }) => {
  const [audioDuration, setAudioDuration] = React.useState<number>();

  const audioPlayer = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    (async () => {
      audioPlayer?.current?.addEventListener("loadedmetadata", () => {
        var duration = audioPlayer?.current?.duration;
        setAudioDuration(duration);
        audioPlayer?.current?.play();
      });
    })();
  }, []);

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
      <div className={styles.aiPopWrapper}>
        {typeof data === "string" && data}
        {typeof data === "object" && data?.map((item: any, index: number) => {
          switch (item?.type) {
            case "message":
              return (
                <div
                  className={styles.aiPopText}
                  key={index}
                >
                  {item?.data}
                </div>
              )
            case "data":
              return (
                <div
                  className={styles.aiPopAudio}
                  key={index}
                >
                  <div className={styles.aiPopAudioTime}>
                    {audioDuration && `${audioDuration.toFixed(2)}`}''
                  </div>
                  <BsSoundwave
                    className={styles.aiPopAudioIcon}
                  />
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
