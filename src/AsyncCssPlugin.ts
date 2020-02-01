import { Hooks } from "html-webpack-plugin";
import { Compiler } from "webpack";

interface IUntypedHooks {
    [key: string]: unknown;
}

// tslint:disable-next-line: no-default-export
export default class AsyncCssPlugin {
    public apply(compiler: Compiler): void {
        if (!compiler.hooks) {
            throw new Error("Missing hooks property. The version of your webpack package is probably too old.");
        }

        compiler.hooks.compilation.tap(
            AsyncCssPlugin.name,
            (compilation) => this.checkHook(compilation.hooks as unknown as IUntypedHooks));
    }

    private checkHook(hooks: IUntypedHooks) {
        if (!hooks.htmlWebpackPluginAlterAssetTags) {
            throw new Error("Missing hook. Your webpack configuration is probably missing the HtmlWebpackPlugin.");
        }

        (hooks as unknown as Hooks).htmlWebpackPluginAlterAssetTags.tap(
            AsyncCssPlugin.name, (data) => this.process(data));
    }

    // tslint:disable-next-line: prefer-function-over-method
    private process(data: Parameters<Parameters<Hooks["htmlWebpackPluginAlterAssetTags"]["tap"]>[1]>[0]) {
        for (const { tagName, attributes } of data.head) {
            if ((tagName === "link") && (attributes.rel === "stylesheet")) {
                if (attributes.media) {
                    console.warn(`The link for ${attributes.href} already has a media attribute, will not modify.`);
                } else {
                    attributes.media = "print";
                    attributes.onload = attributes.onload ? `${attributes.onload};` : "";
                    attributes.onload += "this.media='all'";
                }
            }
        }

        return data;
    }
}
