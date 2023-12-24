import React, { useEffect, useRef } from "react";
import styles from "../style.less";
import { Button, Input } from "antd";
import { HiOutlineMicrophone } from "react-icons/hi";
import { BsSoundwave } from "react-icons/bs";
import classNames from "classnames";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { IoIosPause, IoMdRefresh } from "react-icons/io";
import { IoPlayOutline } from "react-icons/io5";

const { TextArea } = Input;

const CreateRecord: React.FC<{
  record: Blob | null;
  setRecord: React.Dispatch<React.SetStateAction<Blob | null>>;
}> = ({ record, setRecord }) => {
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  const recorderControls = useAudioRecorder();
  const player = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!!recorderControls.recordingBlob && !isRecording) {
      setRecord(recorderControls.recordingBlob);
    }
  }, [recorderControls.recordingBlob]);

  return (
    <>
      <div className={styles.createWrapper}>
        <div className={styles.createHeader}>
          <div className={styles.createSteps}>
            2 / 2
          </div>
          <div className={styles.createName}>
            Record your voice by reading the paragraph below.
          </div>
          <div className={styles.createContent}>
            <TextArea
              bordered={false}
              className={styles.createContentInput}
              rows={8}
              readOnly
              value='The sun was setting, turning the sky pink and orange. Everywhere you looked, the world seemed to be covered in a warm, glowing light. Leaves on the trees moved softly in the wind, making a gentle rustling sound. Birds were chirping loudly, happy to be heading home.'
            />
          </div>
          {!record ? (
            <div className={styles.createRecordAction}>
              <AudioRecorder
                onRecordingComplete={(blob) => {
                  const url = URL.createObjectURL(blob);
                  const audio = document.createElement("audio");
                  audio.src = url;
                  audio.controls = true;
                  document.body.appendChild(audio);
                  console.log(blob)
                }}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
                classes={{
                  AudioRecorderClass: styles.createRecordAudioRecorder,
                }}
              />
              <div className={styles.createRecordButton}>
                <Button
                  type="primary"
                  shape="circle"
                  size="large"
                  className={styles.createRecordButtonIcon}
                  onClick={() => {
                    setIsRecording(!isRecording);
                    if (!isRecording) {
                      recorderControls.startRecording();
                    } else {
                      recorderControls.stopRecording();
                    }
                  }}
                >
                  {isRecording ? (
                    <BsSoundwave />
                  ) : (
                    <HiOutlineMicrophone />
                  )}
                </Button>
                <div
                  className={classNames(styles.createRecordButtonMask, {
                    [styles.createRecordButtonShadowAnimation]: isRecording,
                  })}
                />
              </div>
              <div className={styles.createRecordText}>
                {isRecording ? 'Click to stop record' : 'Click to record audio'}
              </div>
            </div>
          ) : (
            <div className={styles.createRecordReadyAction}>
              <audio
                src={URL.createObjectURL(record)}
                ref={player}
                className={styles.createRecordReadyAudio}
              />
              <div className={styles.createRecordRetry}>
                <Button
                  type="primary"
                  shape="circle"
                  size="large"
                  className={styles.createRecordRetryIcon}
                  onClick={() => {
                    setRecord(null);
                    player.current?.pause();
                    setIsPlaying(false);
                  }}
                >
                  <IoMdRefresh />
                </Button>
                <div className={styles.createRecordRetryText}>
                  Retry
                </div>
              </div>
              {!isPlaying ? (
                <div className={styles.createRecordPlay}>
                  <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    className={styles.createRecordPlayIcon}
                    onClick={() => {
                      player.current?.play();
                      setIsPlaying(true);
                    }}
                  >
                    <IoPlayOutline />
                  </Button>
                  <div className={styles.createRecordPlayText}>
                    Play
                  </div>
                </div>
              ) : (
                <div className={styles.createRecordPlay}>
                  <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    className={styles.createRecordPlayIcon}
                    onClick={() => {
                      player.current?.pause();
                      setIsPlaying(false);
                    }}
                  >
                    <IoIosPause />
                  </Button>
                  <div className={styles.createRecordPlayText}>
                    Stop
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={styles.createFooter}>
          <Button
            block
            type="primary"
            shape="round"
            size="large"
            className={styles.createFooterButton}
            disabled={!record}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  )
};

export default CreateRecord;
