import HtmlWebpackPlugin from "html-webpack-plugin";

import { MessageType, Options } from "./Options";

type AlterAssetTagsData = Parameters<Parameters<HtmlWebpackPlugin.Hooks["alterAssetTags"]["tap"]>[1]>[0];

// tslint:disable-next-line: no-default-export
export default class AsyncCssPlugin {
    public constructor(options: Options = {}) {
        Object.assign(this.options, options);
    }

    public apply(compiler: any): void {
        // tslint:disable-next-line: no-unsafe-any
        if (!compiler.hooks) {
            this.log("error", "hooks is undefined. Is the version of your webpack package too old?");
        }

        // tslint:disable-next-line: no-unsafe-any
        compiler.hooks.compilation.tap(AsyncCssPlugin.name, (compilation: any) => this.checkHook(compilation));
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

    private checkHook(compilation: any) {
        // tslint:disable: no-unsafe-any
        const { hooks: { htmlWebpackPluginAlterAssetTags } } = compilation;

        if (htmlWebpackPluginAlterAssetTags) {
            // html-webpack-plugin v3
            htmlWebpackPluginAlterAssetTags.tap(AsyncCssPlugin.name, (page: any) => this.processPage(page));
            // tslint:enable: no-unsafe-any
        } else if (HtmlWebpackPlugin && HtmlWebpackPlugin.getHooks) {
            // html-webpack-plugin v4
            // tslint:disable-next-line: no-unsafe-any
            const hooks = HtmlWebpackPlugin.getHooks(compilation);
            hooks.alterAssetTags.tap(AsyncCssPlugin.name, (data) => this.processData(data));
        } else {
            this.log("error", "Cannot find hook. Is your configuration missing the HtmlWebpackPlugin?");
        }
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

    private processData(data: AlterAssetTagsData) {
        for (const tag of data.assetTags.styles) {
            if ((tag.tagName === "link") && (tag.attributes.rel === "stylesheet")) {
                this.processTag(data.outputName, tag);
            }
        }

        return data;
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
