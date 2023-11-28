import { CharacterInfo } from "@/services/typing";

export const charactersData: CharacterInfo[] = [
  {
    name: "Justin Sun",
    handle: "justinsuntron",
    character_id: "justin_sun",
    avatar_url:
      "https://pbs.twimg.com/profile_images/1490173066357342208/MZyfamFE.jpg",
    avatar_key: "MZyfamFE",
    background:
      "https://pbs.twimg.com/media/F0V34ZLaUAEqltw?format=jpg&name=medium",
    token_icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    questions: ["Sir wen moon?", "Where are you?", "Give me some TRX!"],
  },
];

export const ADDRESS_CONFIG = {
  Sun: {
    Goerli: "CecB7683E1Fa399Ff2457dE8B33D9110939547d6",
    Arbitrum: "52aBD651F0D56C2F7772DcEcEB7495b86BFaeEbD",
  },
};
