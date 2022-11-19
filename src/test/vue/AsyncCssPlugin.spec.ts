import { expect } from "chai";
import { exec } from "child_process";
import { rmSync } from "fs";

import { getLinkProperties } from "../getLinkProperties";

const createMochaFunc = (expectedMedia: string): Mocha.Func =>
    function(done) {
        this.timeout(0);
        exec(`cd ${__dirname} && npx vue-cli-service build`, (error) => {
            // tslint:disable-next-line: no-unused-expression
            expect(error).to.be.null;
            const outputPath = `${__dirname}/dist`;
            const { href, media } = getLinkProperties(`${outputPath}/index.html`);
            expect(href).to.equal("/css/app.7a683809.css");
            expect(media).to.equal(expectedMedia);
            rmSync(outputPath, { recursive: true });
            rmSync(`${__dirname}/node_modules`, { recursive: true }); // vue v2 creates this during compilation
            done();
        });
    };

describe("AsyncCssPlugin", () => {
    describe("vue", () => {
        // tslint:disable-next-line: no-unsafe-any
        it("should modify index.html", createMochaFunc("print"));
    });
});
