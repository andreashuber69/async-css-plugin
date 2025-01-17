// https://github.com/andreashuber69/kiss-worker/blob/develop/README.md

import { defineWorkspace } from "vitest/config";

// eslint-disable-next-line import/no-anonymous-default-export, import/no-default-export
export default defineWorkspace([
    {
        test: {
            name: "node",
        },
    },
]);
