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
      path: "/chat",
      routes: [
        {
          path: "/chat/:id",
          component: "chat",
        },
        {
          path: "/chat/demo",
          component: "chat/demo",
        },
      ],
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
});
