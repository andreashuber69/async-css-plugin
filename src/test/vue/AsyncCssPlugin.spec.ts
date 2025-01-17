// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin

import { exec } from "node:child_process";
import { rmSync } from "node:fs";
import { promisify } from "node:util";

import { describe, expect, it } from "vitest";

import { getLinkProperties } from "../getLinkProperties.js";

const execAsync = promisify(exec);

describe("AsyncCssPlugin", () => {
    describe("vue", () => {
        it("should modify index.html", async () => {
            await execAsync(`cd ${__dirname} && export NODE_ENV=production && npx vue-cli-service build`);
            const outputPath = `${__dirname}/dist`;
            const { href, media } = getLinkProperties(`${outputPath}/index.html`);
            expect(href).to.equal("/css/app.5e6ccbdf.css");
            expect(media).to.equal("print");
            rmSync(outputPath, { recursive: true });
        });
    });
});
