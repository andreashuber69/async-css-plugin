// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin

import { rmSync } from "node:fs";
import Service from "@vue/cli-service";

import { describe, expect, it } from "vitest";

import { getLinkProperties } from "../getLinkProperties.ts";

describe("AsyncCssPlugin", () => {
    describe("vue", () => {
        it("should modify index.html", async () => {
            process.env["NODE_ENV"] = "production";
            const service = new Service(__dirname);
            await service.run("build");
            const outputPath = `${__dirname}/dist`;
            const { href, media } = getLinkProperties(`${outputPath}/index.html`);
            expect(href).to.equal("/css/app.5e6ccbdf.css");
            expect(media).to.equal("print");
            rmSync(outputPath, { recursive: true });
        });
    });
});
