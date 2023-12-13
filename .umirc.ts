import { defineConfig } from "@umijs/max";

export default defineConfig({
  antd: {},
  model: {},
  routes: [
    {
      path: "/",
      component: "home",
    },
    {
      path: "/portfolio",
      component: "portfolio",
    },
    {
      path: "/chat",
      routes: [
        {
          path: "/chat",
          component: "chat",
        },
        {
          path: "/chat/:id",
          component: "chat/detail",
        },
      ],
    },
    {
      path: "/me",
      routes: [
        {
          path: "/me",
          component: "me",
        },
      ],
    },
    {
      path: "/create",
      routes: [
        {
          path: "/create",
          component: "create",
        },
      ],
    },
    {
      path: "/bridge",
      component: "bridge",
    },
  ],
  manifest: {
    basePath: "/",
  },
  fastRefresh: true,
  npmClient: "yarn",
  jsMinifierOptions: {
    target: ["chrome80", "es2020"],
  },
  hash: true,
  cssMinifier: "cssnano",
  links: [
    {
      rel: "icon",
      href: "/logo.svg",
      type: "image/x-icon",
    },
  ],
  metas: [
    {
      name: "keywords",
      content: "meta,web3,blockchain,ethereum,social,ai",
    },
    {
      name: "description",
      content: "Parami AIME",
    },
    {
      httpEquiv: 'Cache-Control',
      content: 'no-cache',
    },
    {
      httpEquiv: 'Pragma',
      content: 'no-cache',
    },
    {
      httpEquiv: 'Expires',
      content: '0',
    },
    {
      name: 'title',
      content: 'AIME - AI-Powered ME for my Web3 Social Network',
    },
    {
      name: 'og:title',
      content: 'AIME - AI-Powered ME for my Web3 Social Network',
    },
    {
      name: 'description',
      content: 'Join AIME now and start earning today!'
    },
    {
      name: 'og:description',
      content: 'Join AIME now and start earning today!'
    },
    {
      name: 'og:image',
      content: 'https://ibb.co/XSXKn3R'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:image',
      content: 'https://ibb.co/XSXKn3R'
    },
    {
      name: 'twitter:site:domain',
      content: 'parami.io'
    },
    {
      name: 'twitter:url',
      content: 'https://t.me/aime_beta_bot/aimeapp'
    }
  ]
});
