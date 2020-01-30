import { Compiler } from "webpack";

export default class AsyncCssPlugin {
    public apply(compiler: Compiler): void {
        console.log(compiler);
    }
}