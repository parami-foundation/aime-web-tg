import { CharacterInfo } from "@/services/typing";

export const charactersData: CharacterInfo[] = [
  {
    name: "Justin Sun",
    handle: "justinsuntron",
    character_id: "justin_sun",
    avatar_url:
      "https://media.licdn.com/dms/image/C5103AQEjthnHx0FTLQ/profile-displayphoto-shrink_800_800/0/1536214237739?e=2147483647&v=beta&t=Th9UXbvF5Rc9oF6E-C4HFotvCZQbDj-AH5BVN2wtWbw",
    avatar_key: "MZyfamFE",
    background:
      "https://pbs.twimg.com/media/F0V34ZLaUAEqltw?format=jpg&name=medium",
    token_icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    share_message:
      "Come with me, let's make money together. I will take you to new heights of earning money.",
    questions: ["Sir wen moon?", "Where are you?", "Give me some TRX!"],
  },
];

export const ADDRESS_CONFIG = {
  Sun: {
    Goerli: "CecB7683E1Fa399Ff2457dE8B33D9110939547d6",
    Arbitrum: "52aBD651F0D56C2F7772DcEcEB7495b86BFaeEbD",
  },
};
