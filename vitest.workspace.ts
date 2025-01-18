// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin

import { defineWorkspace } from "vitest/config";

// eslint-disable-next-line import/no-anonymous-default-export, import/no-default-export
export default defineWorkspace([
    {
        test: {
            name: "node",
        },
    },
]);
