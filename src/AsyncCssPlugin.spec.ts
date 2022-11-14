import { expect } from "chai";
import webpack from "webpack";

// tslint:disable-next-line: no-default-import
import options from "../webpack.config.js";

describe("AsyncCssPlugin", () => {
    it("should modify index.html", (done) => {
        // tslint:disable-next-line: no-unsafe-any
        webpack(options, (err, stats) => {
            // tslint:disable-next-line: no-unused-expression
            expect(err, `${err}`).to.be.null;
            // tslint:disable-next-line: no-unused-expression
            expect(stats.hasErrors(), stats.toString()).to.be.false;

            const files = stats.toJson().assets?.map((x) => x.name);
            expect(files?.indexOf("index.html")).not.equal(-1);
            done();
        });
    });
});
