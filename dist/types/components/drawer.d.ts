type DrawerState = 'open' | 'closed';
export declare function attachDrawer(btn: HTMLButtonElement): {
    init: () => void;
    toggle: () => void;
    open: () => void;
    close: () => void;
    destroy: () => void;
    readonly state: DrawerState | undefined;
    readonly isOpen: boolean;
    readonly isClosed: boolean;
};
export declare function initDrawer(root?: ParentNode): void;
export {};
