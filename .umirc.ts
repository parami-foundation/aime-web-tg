import { defineConfig } from "umi";

export default defineConfig({
  routes: [{ path: "/", component: "auth" }],
  manifest: {
    basePath: "/",
  },
  fastRefresh: true,
  npmClient: "yarn",
  jsMinifierOptions: {
    target: ["chrome80", "es2020"],
  },
  cssMinifier: "cssnano",
});
