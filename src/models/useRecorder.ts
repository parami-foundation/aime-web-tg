import hark from "hark";
import React from "react";
import { useModel } from "@umijs/max";
import { notification } from "antd";
import { DEBUG } from "@/constants/global";

export default () => {
  const { selectedMicrophone } = useModel("useSetting");
  const { audioContext } = useModel("useWebRTC");
  const { sendOverSocket, SendMessageType } = useModel("useWebsocket");

  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] =
    React.useState<MediaRecorder | null>(null);
  const [vadEvents, setVadEvents] = React.useState<hark.Harker | null>(null);
  const [isSpeaking, setIsSpeaking] = React.useState<boolean>(false);
  const [speakingMaxGap, setSpeakingMaxGap] = React.useState<number>(500); //in ms
  const [delayedSpeakingTimeoutID, setDelayedSpeakingTimeoutID] =
    React.useState<NodeJS.Timeout>();
  const [micStream, setMicStream] = React.useState<MediaStream | null>(null);

  const startRecording = () => {
    console.log("start recording");
    if (!mediaRecorder) return;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    console.log("stop recording");
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setIsRecording(false);
  };

  const closeMediaRecorder = () => {
    stopRecording();
    setMediaRecorder(null);
  };

  const vadEventsCallback = (
    voiceStartCallback: () => void,
    voiceInterimCallback: () => void,
    voiceEndCallback: () => void
  ) => {
    if (!micStream) return;
    let vadEvents = hark(micStream, { interval: 20, threshold: -50 });
    vadEvents.on("speaking", () => {
      voiceStartCallback();
      if (!isSpeaking) {
        setIsSpeaking(true);
      } else {
        clearTimeout(delayedSpeakingTimeoutID);
      }
    });
    vadEvents.on("stopped_speaking", () => {
      if (isSpeaking) {
        const task = setTimeout(() => {
          voiceEndCallback();
          setIsSpeaking(false);
        }, speakingMaxGap);
        setDelayedSpeakingTimeoutID(task);
        voiceInterimCallback();
      }
    });
    vadEvents.suspend();
    setVadEvents(vadEvents);
  };

  const enableVAD = () => {
    vadEvents?.resume();
  };

  const disableVAD = () => {
    if (!!vadEvents) {
      vadEvents.suspend();
    }
  };

  const closeVAD = () => {
    vadEvents?.stop();
    setVadEvents(null);
    setIsSpeaking(false);
  };

  const connectMicrophone = async () => {
    const deviceId = selectedMicrophone.values().next().value;
    if (mediaRecorder) return;

    navigator.mediaDevices
      .getUserMedia({
        audio: {
          deviceId: deviceId ? deviceId : undefined,
        },
      })
      .then((stream) => {
        if (!audioContext) return;
        let micStreamSourceNode = audioContext.createMediaStreamSource(stream);
        let gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(1.5, audioContext.currentTime);
        let delayNode = audioContext.createDelay(0.5);
        delayNode.delayTime.value === 0.1;
        let micStreamDestinationNode =
          audioContext.createMediaStreamDestination();
        let mediaRecorder = new MediaRecorder(micStreamDestinationNode.stream);
        micStreamSourceNode
          .connect(gainNode)
          .connect(delayNode)
          .connect(micStreamDestinationNode);
        // Temporary workaround for mimic stop event behavior, as for now on iOS 16 stop event doesn't fire.
        mediaRecorder.ondataavailable = (event) => {
          let blob = new Blob([event.data], { type: "audio/mp3" });
          sendOverSocket(SendMessageType.BLOB, blob);
        };
        setMediaRecorder(mediaRecorder);
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
        if (err.name === "NotAllowedError") {
          if (DEBUG)
            notification.error({
              key: "notAllowedError",
              message: "Not Allowed Error",
              description:
                "Permission Denied: Please grant permission to access the microphone and refresh the website to try again!",
            });
          console.log(
            "Permission Denied: Please grant permission to access the microphone and refresh the website to try again!"
          );
        } else if (err.name === "NotFoundError") {
          if (DEBUG)
            notification.error({
              key: "notFoundError",
              message: "Not Found Error",
              description:
                "No Device Found: Please check your microphone device and refresh the website to try again.",
            });
          console.log(
            "No Device Found: Please check your microphone device and refresh the website to try again."
          );
        }
        closeMediaRecorder();
        // TODO: Route to / ?
      });
  };

  const disconnectMicrophone = () => {
    closeMediaRecorder();
    closeVAD();
    if (!!micStream) {
      micStream.getTracks().forEach((track) => track.stop());
    }
    setMicStream(null);
  };

  return {
    vadEvents,
    isRecording,
    mediaRecorder,
    startRecording,
    stopRecording,
    closeMediaRecorder,
    connectMicrophone,
    disconnectMicrophone,
    enableVAD,
    closeVAD,
    disableVAD,
    vadEventsCallback,
  };
};
