import { Character } from "@/services/typing";

export const charactersData: Map<string, Character> = new Map([
  [
    "justin_sun",
    {
      id: "justin_sun",
      name: "Justin Sun",
      handle: "justinsuntron",
      avatar_url:
        "https://media.licdn.com/dms/image/C5103AQEjthnHx0FTLQ/profile-displayphoto-shrink_800_800/0/1536214237739?e=2147483647&v=beta&t=Th9UXbvF5Rc9oF6E-C4HFotvCZQbDj-AH5BVN2wtWbw",
      author_name: "Justin Sun",
      background:
        "https://pbs.twimg.com/media/F0V34ZLaUAEqltw?format=jpg&name=medium",
      token: {
        id: "TRX",
        name: "TRON",
        symbol: "TRX",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
      },
      share_message:
        "Come with me, let's make money together. I will take you to new heights of earning money.",
      wallet: {
        goerli: "CecB7683E1Fa399Ff2457dE8B33D9110939547d6",
        arbitrum: "52aBD651F0D56C2F7772DcEcEB7495b86BFaeEbD",
      },
      questions: ["Sir wen moon?", "Where are you?", "Give me some TRX!"],
    },
  ],
]);
