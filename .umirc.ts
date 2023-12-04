import { defineConfig } from "@umijs/max";

export default defineConfig({
  antd: {},
  model: {},
  routes: [
    {
      path: "/",
      component: "auth",
    },
    {
      path: "/home",
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
  proxy: {
    "/proxy": {
      target: "https://aime-api-beta.parami.io",
      changeOrigin: true,
      pathRewrite: { "^/proxy": "" },
    },
  },
  hash: true,
  cssMinifier: "cssnano",
  metas: [
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
