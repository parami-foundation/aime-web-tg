import { Character } from "@/types";
import React from "react";

export const languageList: string[] = [
  "English",
  "Spanish",
  "French",
  "German",
  "Hindi",
  "Italian",
  "Polish",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
];

export default () => {
  const [selectedSpeaker, setSelectedSpeaker] = React.useState<Set<string>>(
    new Set(["default"])
  );
  const [selectedMicrophone, setSelectedMicrophone] = React.useState<
    Set<string>
  >(new Set(["default"]));
  const [microphoneList, setMicrophoneList] = React.useState<MediaDeviceInfo[]>(
    []
  );
  const [speakerList, setSpeakerList] = React.useState<MediaDeviceInfo[]>([]);
  const [isMute, setIsMute] = React.useState<boolean>(false);
  const [character, setCharacter] = React.useState<Character>({});
  const [preferredLanguage, setPreferredLanguage] = React.useState<Set<string>>(
    new Set(["English"])
  );
  const [selectedModel, setSelectedModel] = React.useState<Set<string>>(
    new Set(["gpt-3.5-turbo-16k"])
  );
  const [enableGoogle, setEnableGoogle] = React.useState<boolean>(false);
  const [enableQuivr, setEnableQuivr] = React.useState<boolean>(false);
  const [enableMultiOn, setEnableMultiOn] = React.useState<boolean>(false);

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
    character,
    setSelectedSpeaker,
    setSelectedMicrophone,
    setIsMute,
    setCharacter,
    microphoneList,
    speakerList,
    preferredLanguage,
    setPreferredLanguage,
    languageList,
    selectedModel,
    setSelectedModel,
    enableGoogle,
    setEnableGoogle,
    enableQuivr,
    setEnableQuivr,
    enableMultiOn,
    setEnableMultiOn,
  };
};
