// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin
const AsyncCssPlugin = require("../../..");

module.exports = {
    configureWebpack: config => {
        config.entry.app = "./main.js";
    },
    chainWebpack: config => {
        config.plugin("async-css-plugin").use(AsyncCssPlugin, [{ logLevel: "info" }]);
    },
};
