import { LBAudioElement } from "@/pages/chat/detail";
import { LBArrayBuffer } from "@/utils/audioUtils";
import { useModel } from "@umijs/max";
import React from "react";

export interface LBRTCPeerConnection extends RTCPeerConnection {
  sdpSemantics: string;
}

export default () => {
  const { selectedMicrophone } = useModel("useSetting");

  const [shouldPlayAudio, setShouldPlayAudio] = React.useState<boolean>(true);
  const [audioQueue, setAudioQueue] = React.useState<LBArrayBuffer[]>([]);
  const [audioPlayerRef, setAudioPlayerRef] =
    React.useState<React.RefObject<LBAudioElement>>();
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [audioContext, setAudioContext] = React.useState<AudioContext | null>(
    null
  );
  const [incomingStreamDestination, setIncomingStreamDestination] =
    React.useState<MediaStreamAudioDestinationNode | null>(null);
  const [pc, setPC] = React.useState<RTCPeerConnection | null>(null);
  const [otherPC, setOtherPC] = React.useState<RTCPeerConnection | null>(null);
  const [micStream, setMicStream] = React.useState<MediaStream | null>(null);
  const [rtcConnectionEstablished, setRtcConnectionEstablished] =
    React.useState<boolean>(false);
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

  const connectPeer = async () => {
    let pc = new RTCPeerConnection();
    let otherPC = new RTCPeerConnection();

    if (pc) {
      console.log(
        "Should not call connectPeer if webrtc connection already established!"
      );
    }
    pc = new RTCPeerConnection({
      sdpSemantics: "unified-plan",
    } as RTCConfiguration);
    setPC(
      new RTCPeerConnection({
        sdpSemantics: "unified-plan",
      } as RTCConfiguration)
    );

    otherPC = new RTCPeerConnection({
      sdpSemantics: "unified-plan",
    } as RTCConfiguration);
    setOtherPC(
      new RTCPeerConnection({
        sdpSemantics: "unified-plan",
      } as RTCConfiguration)
    );

    pc.onicecandidate = (e) =>
      e.candidate && otherPC.addIceCandidate(new RTCIceCandidate(e.candidate));
    otherPC.onicecandidate = (e) =>
      e.candidate && pc.addIceCandidate(new RTCIceCandidate(e.candidate));
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        !!audioPlayerRef?.current &&
          audioPlayerRef.current?.srcObject === event.streams[0];
      }
    };
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: selectedMicrophone.values().next().value,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    setMicStream(stream);
    await stream.getTracks().forEach(function (track) {
      pc.addTrack(track, stream);
    });
    // Maintain a single audio stream for the duration of the call.
    let audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    setAudioContext(audioContext);

    let incomingStreamDestination = audioContext.createMediaStreamDestination();
    console.log("incomingStreamDestination", incomingStreamDestination);
    setIncomingStreamDestination(incomingStreamDestination);

    incomingStreamDestination.stream.getTracks().forEach(function (track) {
      otherPC.addTrack(track, incomingStreamDestination.stream);
    });

    // Negotiation between two local peers.
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await otherPC.setRemoteDescription(offer);
    const answer = await otherPC.createAnswer();
    await otherPC.setLocalDescription(answer);
    await pc.setRemoteDescription(answer);

    return new Promise<void>((resolve) => {
      pc.oniceconnectionstatechange = (e) => {
        if (pc.iceConnectionState === "connected") {
          console.log("WebRTC ICE Connected!");
          setRtcConnectionEstablished(true);
          resolve();
        }
      };
    });
  };

  const closePeer = () => {
    pc?.close();
    otherPC?.close();
    setPC(null);
    setOtherPC(null);
    setRtcConnectionEstablished(false);
  };

  return {
    pushAudioQueue,
    stopAudioPlayback,
    popAudioQueueFront,
    connectPeer,
    closePeer,
    shouldPlayAudio,
    audioQueue,
    isPlaying,
    audioContext,
    incomingStreamDestination,
    audioPlayerRef,
    rtcConnectionEstablished,
    currentAudio,
    setShouldPlayAudio,
    setAudioPlayerRef,
    setIsPlaying,
    setRtcConnectionEstablished,
    setCurrentAudio,
  };
};
