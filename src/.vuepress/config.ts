import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchPlugin } from "@vuepress/plugin-search";

export default defineUserConfig({
  base: "/",


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
  head: [[
    "script",
      {
        charset: "UTF-8",
        id: "LA_COLLECT",
        src: "//sdk.51.la/js-sdk-pro.min.js?id=KDeTDcfevxjOrgMS&ck=KDeTDcfevxjOrgMS",
      },
  ]]
});
