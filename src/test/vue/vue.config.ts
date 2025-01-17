// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin

import AsyncCssPlugin from "../../AsyncCssPlugin";

// eslint-disable-next-line import/no-anonymous-default-export, import/no-default-export
export default {
    configureWebpack: (config: { entry: { app: string } }) => {
        config.entry.app = "./main.js";
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chainWebpack: (config: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        config.plugin("async-css-plugin").use(AsyncCssPlugin, [{ logLevel: "info" }]);
    },
};
