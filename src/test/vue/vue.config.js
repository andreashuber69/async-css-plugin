// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin

if (!require.extensions[".ts"]) {
    require("ts-node").register({
        project: "./tsconfig.json",
        compilerOptions: {
            module: "commonjs",
        },
    });
}

module.exports = require("./vueConfig.ts").default;
