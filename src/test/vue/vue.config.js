// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin

// eslint-disable-next-line import/unambiguous
if (!require.extensions[".ts"]) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("ts-node").register({
        project: "./tsconfig.json",
        compilerOptions: {
            module: "commonjs",
        },
    });
}

// eslint-disable-next-line import/no-commonjs, @typescript-eslint/no-require-imports
module.exports = require("./vueConfig.ts").default;
