import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchPlugin } from "@vuepress/plugin-search";

export default defineUserConfig({
  base: "/jielahou-blog/",


  locales: {
    "/": {
      lang: "zh-CN",
      title: "Jielahou's Blog",
      description: "Jielahou的博客",
    },
  },

  theme,

  plugins: [
    searchPlugin({
      // 你的选项
    }),
  ],

  shouldPrefetch: false,
});
