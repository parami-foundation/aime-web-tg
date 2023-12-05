import { Character } from "@/services/typing";

export const charactersData: Map<string, Character> = new Map([
  [
    "justin_sun",
    {
      id: "justin_sun",
      name: "Justin Sun",
      handle: "justinsuntron",
      avatar_url:
        "https://media.licdn.com/dms/image/C5103AQEjthnHx0FTLQ/profile-displayphoto-shrink_800_800/0/1536214239566?e=2147483647&v=beta&t=2aYr46B0V388lpOZc47XAwjRSqWKG1DLQB7oeO9-xI4",
      author_name: "Justin Sun",
      description: "You’re wasting my time. I literally rule the world.",
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
        arbitrum: "db61B2aD59bdF2A066B7fC9F00f86c3EBc4856B4",
      },
      questions: ["Sir wen moon?", "Where are you?", "Give me some TRX!"],
      tags: ["Business", "Tech"],
      chat_count: 2978,
      value: 899.00,
      twitter: {
        id: "justinsuntron",
        name: "H.E. Justin Sun 孙宇晨",
        screen_name: "H.E. Justin Sun 孙宇晨",
        profile_image_url_https:
          "https://pbs.twimg.com/profile_images/1490173066357342208/MZyfamFE_400x400.jpg",
      },
    },
  ],
]);
