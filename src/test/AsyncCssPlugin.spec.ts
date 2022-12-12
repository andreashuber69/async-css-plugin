import { expect } from "chai";

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, import/no-commonjs, @typescript-eslint/no-require-imports
const AsyncCssPlugin = require("../../dist/AsyncCssPlugin");

describe("AsyncCssPlugin", () => {
    describe("constructor", () => {
        it("should throw for invalid options", () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
            expect(() => new AsyncCssPlugin({ logLevel: "whatever" })).to.throw(
                Error,
                "options.logLevel is invalid: whatever.",
            );
        });
    });
    describe("apply", () => {
        it("should throw for invalid compiler", () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            const sut = new AsyncCssPlugin();
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            expect(() => sut.apply()).to.throw(
                Error,
                "compiler?.hooks?.compilation?.tap is undefined. Is your webpack package version too old?",
            );
        });
    });
});
