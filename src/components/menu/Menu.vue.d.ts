import type { pt } from "@/utils/object.utils";
import type { Icons } from "../icons/Icons.vue";
import type { PassThroughOptions } from "primevue/passthrough";
import type { MenuRouterBindProps } from "primevue";

export interface MenuProps {
    model?: MenuItem[] | undefined;

    popup?: boolean | undefined;

    appendTo?: 'body' | 'self' | string | undefined | HTMLElement;

    autoZIndex?: boolean | undefined;

    baseZIndex?: number | undefined;

    tabindex?: number | string | undefined;

    ariaLabel?: string | undefined;

    ariaLabelledby?: string | undefined;

    pt?: pt<MenuPassThroughOptions>;

    ptOptions?: PassThroughOptions;

    unstyled?: boolean;
}

export interface MenuSlots {
    start(): VNode[];
    end(): VNode[];

    item(scope: {
        item: MenuItem;
        
        label: string | ((...args: any) => string) | undefined;

        props: MenuRouterBindProps,
    }): VNode[];

    itemicon(scope: {
        item: MenuItem;
        class: any;
    }): VNode[];

    subMenuHeader(scope: {
        item: MenuItem;
    }): VNode[];
}

export interface MenuEmits {
    focus: [event: Event];
    blur: [event: Event];
}

export interface MenuItemCommandEvent {
    originalEvent: Event;

    item: MenuItem;

    [key: string]: any;
}

export interface MenuItem {
    label?: string | ((...args: any) => string) | undefined;

    icon?: string | undefined;

    command?: (event: MenuItemCommandEvent) => void;

    items?: MenuItem[] | undefined;

    danger?: boolean | undefined;

    disabled?: boolean | ((...args: any) => boolean) | undefined;

    visible?: boolean | ((...args: any) => boolean) | undefined;
}

export interface MenuItemProps {
    item: MenuItem;
}