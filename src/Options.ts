export type MessageType = "info" | "warn" | "error";

export interface Options {
    /** "info" logs everything, "warn" logs warnings and errors, "error" logs errors only. Default is "warn". */
    readonly logLevel?: MessageType;
}
