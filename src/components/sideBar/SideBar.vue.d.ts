import type { Icons } from "../icons/Icons.vue.d";

export type SideBarContent = {
    title: string;
    icon?: Icons;
    path?: string;
    visible: boolean;
    isOpen?: boolean;
    children?: SideBarContent[];
}

export interface SideBarProps {
    visible?: boolean;
}