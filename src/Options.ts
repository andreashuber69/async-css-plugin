export type MessageType = "error" | "info" | "warn";

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Options {
    /** "info" logs everything, "warn" logs warnings and errors, "error" logs errors only. Default is "warn". */
    readonly logLevel?: MessageType;
}
