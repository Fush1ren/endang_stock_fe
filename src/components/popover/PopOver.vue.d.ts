import type { pt } from "@/utils/object.utils";
import type { PopoverBreakpoints, PopoverPassThroughOptions } from "primevue";

export interface PopOverProps {
    dismissable?: boolean;
    appendTo?: HTMLElement | HintedString<"body" | "self">;
    baseZIndex?: number;
    autoZIndex?: boolean;
    breakpoints?: PopoverBreakpoints;
    dt?: any;
    pt?: pt<PopoverPassThroughOptions>
    ptOptions?: any;
    closeOnEscape?: boolean;
}

export interface PopOverSlots {
    default(): VNode[];
    container(scope: {
        closeCallback: () => void;

        keydownCallback: (event: Event) => void;
    }): VNode[];
}

export interface PopOverEmits {
    show(): void;
    hide(): void;
}