import React from "react";

export default () => {
  const [selectedSpeaker, setSelectedSpeaker] = React.useState<string[]>([
    "default",
  ]);
  const [selectedMicrophone, setSelectedMicrophone] = React.useState<string[]>([
    "default",
  ]);
  const [microphoneList, setMicrophoneList] = React.useState<MediaDeviceInfo[]>(
    []
  );
  const [speakerList, setSpeakerList] = React.useState<MediaDeviceInfo[]>([]);
  const [isMute, setIsMute] = React.useState<boolean>(false);

  const getAudioList = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const res = await navigator.mediaDevices.enumerateDevices();
    const audioInputDevices = res.filter(
      (device) => device.kind === "audioinput"
    );
    const audioOutputDevices = res.filter(
      (device) => device.kind === "audiooutput"
    );
    if (audioInputDevices.length === 0) {
      console.log("No audio input devices found");
    } else {
      setMicrophoneList(audioInputDevices);
    }
    if (audioOutputDevices.length === 0) {
      console.log("No audio output devices found");
    } else {
      setSpeakerList(audioOutputDevices);
    }
  };

  return {
    getAudioList,
    selectedSpeaker,
    selectedMicrophone,
    isMute,
    setSelectedSpeaker,
    setSelectedMicrophone,
    setIsMute,
  };
};
