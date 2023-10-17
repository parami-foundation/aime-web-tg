import { IApi } from "@umijs/max";

export default (api: IApi) => {
  api.addHTMLMetas(() => {
    return [
      {
        name: "keywords",
        content: "meta,web3,blockchain,ethereum,social,ai",
      },
      {
        name: "description",
        content: "Parami AIME",
      },
      {
        "http-equiv": "Pragma",
        content: "no-cache",
      },
      {
        "http-equiv": "Cache-Control",
        content: "no-cache",
      },
      {
        "http-equiv": "Expires",
        content: "0",
      },
    ];
  });

  api.addHTMLLinks(() => {
    return [
      {
        rel: "icon",
        href: "/logo.svg",
        type: "image/x-icon",
      },
    ];
  });
};
