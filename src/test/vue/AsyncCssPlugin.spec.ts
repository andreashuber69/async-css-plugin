import { expect } from "chai";
import { exec } from "child_process";
import { readFileSync, rmSync } from "fs";
import { JSDOM } from "jsdom";

const findCssLinkElement = <T extends { readonly rel: string }>(collection: HTMLCollection, ctor: new () => T) => {
    for (const item of collection) {
        if (item instanceof ctor && (item.rel === "stylesheet")) {
            return item;
        }
    }

    throw new Error(`${window.HTMLLinkElement.name} element not found.`);
};

const createMochaFunc = (expectedMedia: string): Mocha.Func =>
    function(done) {
        this.timeout(0);
        exec(`cd ${__dirname} && npx vue-cli-service build`, (error) => {
            // tslint:disable-next-line: no-unused-expression
            expect(error).to.be.null;
            const outputPath = `${__dirname}/dist`;
            const { window } = new JSDOM(readFileSync(`${outputPath}/index.html`));
            const { href, media } = findCssLinkElement(window.document.head.children, window.HTMLLinkElement);
            expect(href).to.equal("/css/app.7a683809.css");
            expect(media).to.equal(expectedMedia);
            rmSync(outputPath, { recursive: true });
            done();
        });
    };

describe("AsyncCssPlugin", () => {
    describe("vue", () => {
        // tslint:disable-next-line: no-unsafe-any
        it("should modify index.html", createMochaFunc("print"));
    });
});
