// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin

// eslint-disable-next-line n/no-deprecated-api
if (!require.extensions[".ts"]) {
    require("ts-node").register({
        project: "./tsconfig.json",
        compilerOptions: {
            module: "commonjs",
        },
    });
}

module.exports = require("./vue.config.ts").default;
