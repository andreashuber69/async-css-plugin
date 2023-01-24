// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin
export type MessageType = "error" | "info" | "warn";

export interface Options {
    /** "info" logs everything, "warn" logs warnings and errors, "error" logs errors only. Default is "warn". */
    readonly logLevel?: MessageType;
}
