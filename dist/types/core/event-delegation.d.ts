type DelegatedListener = (evt: Event, elm: Element) => void;
export declare function delegateEvent(type: keyof DocumentEventMap, selector: string, id: string, listener: DelegatedListener): void;
export declare function undelegateEvent(type: keyof DocumentEventMap, id: string): void;
export {};
