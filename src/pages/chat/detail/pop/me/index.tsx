import React, { useEffect, createRef } from "react";
import styles from "./style.less";
import { BsSoundwave } from "react-icons/bs";

const MePop: React.FC<{
  data?: any;
}> = ({ data }) => {
  const [audioDuration, setAudioDuration] = React.useState<number>();

  const audioPlayer = createRef<HTMLAudioElement>();

  useEffect(() => {
    (async () => {
      audioPlayer?.current?.addEventListener("loadedmetadata", () => {
        var duration = audioPlayer?.current?.duration;
        setAudioDuration(duration);
      });
    })();
  }, [audioPlayer]);

  return (
    <div
      className={styles.mePopContainer}
      onClick={() => {
        if (!!audioPlayer?.current && audioPlayer?.current?.paused) {
          audioPlayer?.current?.play();
        } else {
          audioPlayer?.current?.pause();
        }
      }}
    >
      <div className={styles.mePopWrapper}>
        {typeof data === "string" && data}
        {typeof data === "object" && data?.map((item: any, index: number) => {
          switch (item?.type) {
            case "message":
              return (
                <div
                  className={styles.mePopText}
                  key={index}
                >
                  {item?.data}
                </div>
              )
            case "data":
              return (
                <div
                  className={styles.mePopAudio}
                  key={index}
                >
                  <div className={styles.mePopAudioTime}>
                    {audioDuration && `${audioDuration.toFixed(2)}`}''
                  </div>
                  <BsSoundwave
                    className={styles.mePopAudioIcon}
                  />
                  <audio
                    className={styles.mePopAudioPlayer}
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

export default MePop;
