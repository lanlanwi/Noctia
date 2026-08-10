type HandlerType = (scrollY: number) => void;
export declare function addScrollHandler(handler: HandlerType, id: string): void;
export declare function removeScrollHandler(id: string): void;
export {};
