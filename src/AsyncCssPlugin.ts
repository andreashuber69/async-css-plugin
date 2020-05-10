import { Compiler } from "webpack";

import { MessageType, Options } from "./Options";

// tslint:disable-next-line: no-default-export
export default class AsyncCssPlugin {
    public constructor(options: Options = {}) {
        Object.assign(this.options, options);
    }

    public apply(compiler: Compiler): void {
        if (!compiler.hooks) {
            this.log("error", "hooks is undefined. Is the version of your webpack package too old?");
        }

        compiler.hooks.compilation.tap(AsyncCssPlugin.name, (compilation) => this.checkHook(compilation.hooks));
    }

    private static assertUnreachable(value: never): never {
        throw new Error(value);
    }

    private readonly options: Required<Options> = { logLevel: "warn" };
    private logged = false;

    private log(messageType: MessageType, message: string) {
        if (this.doLog(messageType)) {
            if (!this.logged) {
                this.logged = true;
                console.log(); // Make sure we start our log on a new line
            }

            console[messageType](`${AsyncCssPlugin.name}[${messageType}]: ${message}`);
        }
    }

    private checkHook(hooks: any) {
        // tslint:disable-next-line: no-unsafe-any
        if (!hooks.htmlWebpackPluginAlterAssetTags) {
            this.log(
                "error",
                "htmlWebpackPluginAlterAssetTags is undefined. Is your configuration missing the HtmlWebpackPlugin?");
        }

        // tslint:disable-next-line: no-unsafe-any
        hooks.htmlWebpackPluginAlterAssetTags.tap(AsyncCssPlugin.name, (page: any) => this.processPage(page));
    }

    private doLog(messageType: MessageType) {
        switch (this.options.logLevel) {
            case "info":
                return true;
            case "warn":
                return messageType !== "info";
            case "error":
                return messageType === "error";
            default:
                return AsyncCssPlugin.assertUnreachable(this.options.logLevel);
        }
    }

    // tslint:disable: no-unsafe-any
    private processPage(page: any) {
        for (const tag of page.head) {
            if ((tag.tagName === "link") && (tag.attributes.rel === "stylesheet")) {
                this.processTag(page.outputName, tag);
                // tslint:enable: no-unsafe-any
            }
        }

        return page;
    }

    // tslint:disable: no-unsafe-any
    // tslint:disable-next-line: prefer-function-over-method
    private processTag(outputName: string, { attributes }: any) {
        if (attributes.media) {
            this.log("warn", `The link for ${attributes.href} already has a media attribute, will not modify.`);
        } else {
            attributes.media = "print";
            attributes.onload = attributes.onload ? `${attributes.onload};` : "";
            attributes.onload += "this.media='all'";
            this.log("info", `${outputName}: Modified link to ${attributes.href}.`);
        }
    }
    // tslint:enable: no-unsafe-any
}
