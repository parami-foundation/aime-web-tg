import React, { useEffect, createRef } from "react";
import styles from "./style.less";
import { ReactComponent as SoundPlayIcon } from '@/assets/icon/soundPlay.svg';
import MDEditor from "@uiw/react-md-editor";
import { v4 as uuidv4 } from 'uuid';

const MePop: React.FC<{
  data?: any;
}> = ({ data }) => {
  const audioPlayer = createRef<HTMLAudioElement>();

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
        {data?.map((item: any, index: number) => {
          switch (item?.type) {
            case "message":
              return (
                <MDEditor.Markdown
                  key={item?.id}
                  source={item?.data as string}
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  className={styles.mePopText}
                />
              )
            case "data":
              return (
                <div
                  className={styles.mePopAudio}
                  key={item?.id}
                >
                  <SoundPlayIcon />
                  <audio
                    className={styles.mePopAudioPlayer}
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

export default MePop;
