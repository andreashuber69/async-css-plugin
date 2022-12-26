import { exec } from "node:child_process";
import { rmSync } from "node:fs";

import { expect } from "chai";

import { getLinkProperties } from "../getLinkProperties";

const createMochaFunc = (expectedMedia: string): Mocha.Func =>
    function create(done) {
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this.timeout(0);
        exec(`cd ${__dirname} && npx vue-cli-service build`, (error) => {
            expect(Boolean(error)).to.equal(false);
            const outputPath = `${__dirname}/dist`;
            const { href, media } = getLinkProperties(`${outputPath}/index.html`);
            expect(href).to.equal("/css/app.5e6ccbdf.css");
            expect(media).to.equal(expectedMedia);
            rmSync(outputPath, { recursive: true });
            done();
        });
    };

describe("AsyncCssPlugin", () => {
    describe("vue", () => {
        it("should modify index.html", createMochaFunc("print"));
    });
});
