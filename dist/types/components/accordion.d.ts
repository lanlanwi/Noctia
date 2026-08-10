type AccordionState = 'open' | 'closed' | 'opening' | 'closing';
export declare function enhanceAccordion(elm: HTMLDetailsElement): {
    init: () => void;
    open: () => Promise<void>;
    close: () => Promise<void>;
    toggle: () => Promise<void> | undefined;
    destroy: () => void;
    readonly state: AccordionState;
    readonly isOpen: boolean;
    readonly isClosed: boolean;
};
export declare function initAccordion(root?: ParentNode): void;
export {};
