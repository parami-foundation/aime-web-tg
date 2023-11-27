import { DEBUG } from "@/constants/global";
import { useModel } from "@umijs/max";
import { notification } from "antd";

export interface LBArrayBuffer extends ArrayBuffer {
  detached: boolean;
}
// play a single audio chunk
export const playAudio = (
  audioPlayer: React.RefObject<HTMLAudioElement>,
  bufferSource: AudioBufferSourceNode
) => {
  return new Promise<void>((resolve) => {
    bufferSource.onended = () => {
      resolve();
    };
    bufferSource.start();
    !!audioPlayer.current &&
      audioPlayer.current
        .play()
        .then(() => {
          !!audioPlayer.current && audioPlayer.current.muted === false; // Unmute after playback starts
        })
        .catch((error: Error) => {
          if (error.name === "NotSupportedError") {
            if (DEBUG)
              notification.error({
                message: "Not Supported Error",
                description: `Playback failed because: ${error}. Please check https://elevenlabs.io/subscription if you have encough characters left.`,
              });
            console.log(
              `Playback failed because: ${error}. Please check https://elevenlabs.io/subscription if you have encough characters left.`
            );
          } else {
            if (DEBUG)
              notification.error({
                message: "Playback failed",
                description: `Playback failed because: ${error}`,
              });
            console.log(`Playback failed because: ${error}`);
          }
        });
  });
};

// play all audio chunks
export const playAudios = async (
  audioContext: AudioContext,
  audioPlayerRef: React.RefObject<HTMLAudioElement>,
  audioQueueRef: React.MutableRefObject<LBArrayBuffer[]>,
  isPlaying: boolean,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  audioSourceNode: MediaStreamAudioDestinationNode,
  popAudioQueueFront: () => void
) => {
  while (audioQueueRef.current.length > 0 && isPlaying) {
    // If the user leaves the page and buffer got deteched.
    if (audioQueueRef.current[0].detached) {
      return;
    }
    const audioBuffer = await audioContext.decodeAudioData(
      audioQueueRef.current[0].slice(16)
    );
    const bs = audioContext.createBufferSource();
    bs.buffer = audioBuffer;
    bs.connect(audioSourceNode);

    await playAudio(audioPlayerRef, bs);
    popAudioQueueFront();
  }
  console.log("done playing audios");
  // done playing audios
  setIsPlaying(false);
};
