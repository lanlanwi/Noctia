export declare function abortManager(): {
    create(): void;
    cancel(): void;
    readonly signal: AbortSignal;
};
