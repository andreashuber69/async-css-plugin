// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin

import config from "@andreashuber69/eslint-config";

// eslint-disable-next-line import/no-anonymous-default-export, import/no-default-export
export default [
    ...config,
    {
        ignores: ["coverage/", "dist/", "src/test/**/*.js"],
    },
];
