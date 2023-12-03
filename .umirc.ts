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
});
