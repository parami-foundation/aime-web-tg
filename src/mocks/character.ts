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
      description: "Guess what, I'm a very funny guy.",
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
      chat_count: 2456,
      value: 715.00,
      twitter: {
        id: "justinsuntron",
        name: "H.E. Justin Sun 孙宇晨",
        screen_name: "H.E. Justin Sun 孙宇晨",
        profile_image_url_https:
          "https://pbs.twimg.com/profile_images/1490173066357342208/MZyfamFE_400x400.jpg",
      },
    },
  ],
  [
    "elon_musk",
    {
      id: "elon_musk",
      name: "Elon Musk",
      handle: "elonmusk",
      avatar_url:
        "data:image/jpeg;base64,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",
      author_name: "Elon Musk",
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
      chat_count: 3044,
      value: 899.00,
      twitter: {
        id: "elonmusk",
        name: "Elon Musk",
        screen_name: "Elon Musk",
        profile_image_url_https:
          "https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg",
      },
    },
  ],
  [
    "SBF",
    {
      id: "SBF",
      name: "Sam Bankman-Friedk",
      handle: "SBF",
      avatar_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVV2PH4h03w9llFY3dMPylBPIruircRLesIaQvOr_-IbE3TMAiGubvhUkDqI2vLwIa-Yk&usqp=CAU",
      author_name: "Sam Bankman-Friedk",
      description: "You’re wasting my time.",
      background:
        "https://pbs.twimg.com/profile_banners/1110877798820777986/1648240595/1500x500",
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
      tags: ["Business"],
      chat_count: 2883,
      value: 1299.00,
      twitter: {
        id: "SBF_FTX",
        name: "SBF",
        screen_name: "SBF",
        profile_image_url_https:
          "https://pbs.twimg.com/profile_images/1493575109424160772/AKRRTAI-_400x400.jpg",
      },
    },
  ],
  [
    "CZ",
    {
      id: "CZ",
      name: "Changpeng Zhao",
      handle: "SBF",
      avatar_url:
        "https://pbs.twimg.com/profile_images/1680299608784744448/5oR3tZi5_400x400.jpg",
      author_name: "Changpeng Zhao",
      description: "You’re wasting my time.",
      background:
        "https://pbs.twimg.com/profile_banners/902926941413453824/1597864552/1500x500",
      token: {
        id: "BNB",
        name: "Binance Coin",
        symbol: "BNB",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
      },
      share_message:
        "Come with me, let's make money together. I will take you to new heights of earning money.",
      wallet: {
        goerli: "CecB7683E1Fa399Ff2457dE8B33D9110939547d6",
        arbitrum: "db61B2aD59bdF2A066B7fC9F00f86c3EBc4856B4",
      },
      questions: ["Sir wen moon?", "Where are you?", "Give me some TRX!"],
      tags: ["FTXDestroyer"],
      chat_count: 2978,
      value: 775.00,
      twitter: {
        id: "cz_binance",
        name: "CZ 🔶 BNB",
        screen_name: "CZ 🔶 BNB",
        profile_image_url_https:
          "https://pbs.twimg.com/profile_images/1680299608784744448/5oR3tZi5_400x400.jpg",
      },
    },
  ],
]);
