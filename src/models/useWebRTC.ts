import { LBAudioElement } from "@/pages/chat/detail";
import { LBArrayBuffer } from "@/utils/audioUtils";
import React from "react";

export interface LBRTCPeerConnection extends RTCPeerConnection {
  sdpSemantics: string;
}

export default () => {
  const [shouldPlayAudio, setShouldPlayAudio] = React.useState<boolean>(true);
  const [audioQueue, setAudioQueue] = React.useState<LBArrayBuffer[]>([]);
  const [audioPlayerRef, setAudioPlayerRef] =
    React.useState<React.RefObject<LBAudioElement>>();
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [currentAudio, setCurrentAudio] =
    React.useState<LBArrayBuffer | null>();

  const pushAudioQueue = (audio: LBArrayBuffer) => {
    setAudioQueue((prev) => {
      prev.push(audio);
      return prev;
    });
  };

  const stopAudioPlayback = () => {
    if (!!audioPlayerRef && !!audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setShouldPlayAudio(false);
    }
    setAudioQueue([]);
    setIsPlaying(false);
  };

  const popAudioQueueFront = () => {
    setAudioQueue((prev) => {
      prev.shift();
      return prev;
    });
  };

  return {
    pushAudioQueue,
    stopAudioPlayback,
    popAudioQueueFront,
    shouldPlayAudio,
    audioQueue,
    isPlaying,
    audioPlayerRef,
    currentAudio,
    setShouldPlayAudio,
    setAudioPlayerRef,
    setIsPlaying,
    setCurrentAudio,
  };
};
