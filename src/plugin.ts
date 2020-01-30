// tslint:disable:file-name-casing
import { Compiler } from "webpack";

// tslint:disable-next-line: no-default-export
export default class AsyncCssPlugin {
    public apply(compiler: Compiler): void {
        console.log(compiler);
        console.log(this);
    }
}
