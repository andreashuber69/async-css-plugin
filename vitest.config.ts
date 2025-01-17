// https://github.com/andreashuber69/kiss-worker/blob/develop/README.md

import { defineConfig } from "vitest/config";

// eslint-disable-next-line import/no-anonymous-default-export, import/no-default-export
export default defineConfig({
    test: {
        coverage: {
            provider: "istanbul",
            include: ["src/*.ts"],
            reporter: ["lcov", "text"],
        },
    },
});
