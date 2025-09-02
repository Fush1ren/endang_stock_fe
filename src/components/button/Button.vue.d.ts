import type { ButtonHTMLAttributes, VNode } from "vue";

export type ButtonSeverity = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | 'error';

export interface ButtonProps extends /* @vue-ignore */ ButtonHTMLAttributes {
    style?: any;
    class?: any;
    label?: string;
    icon?: string;
    iconPosition?: "left" | "right";
    severity?: ButtonSeverity;
    rounded?: boolean;
    outlined?: boolean;
    size?: "small" | "medium" | "large";
    plain?: boolean;
    iconClass?: string | undefined;
    type?: "button" | "submit" | "reset";
}

export interface ButtonSlots {
    icon(prop: {
        class: string;
    }): VNode[];
}