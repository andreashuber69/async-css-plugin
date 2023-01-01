// https://github.com/andreashuber69/async-css-plugin#--
const AsyncCssPlugin = require("../../../dist/AsyncCssPlugin");

module.exports = {
    configureWebpack: config => {
        config.entry.app = "./main.js";
    },
    chainWebpack: config => {
        config.plugin("async-css-plugin").use(AsyncCssPlugin, [{ logLevel: "info" }]);
    },
};
