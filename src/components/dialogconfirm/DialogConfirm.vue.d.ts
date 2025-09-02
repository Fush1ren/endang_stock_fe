import type { Slot } from "vue";
import type { Icons } from "../icons/Icons.vue";

export type DialogConfirmServerity = "success" | "info" | "warning" | "error" | 'danger' | "primary";

export interface DialogConfirmProps {
    header: string;
    severity: DialogConfirmServerity;
    confirmButtonSeverity: DialogConfirmServerity;
    visible: boolean;
    closeAfterConfirm?: boolean;
    closeLabel?: string;
    actionable?: boolean;
    confirmLabel?: string;
    headerIcon?: Icons;
    list?: (string | object)[] | Set<string | object>;
    listLabel?: string;
    message?: string;
    showIcon?: boolean;
    showCloseButton?: boolean;
    contentClass?: any;
}

export interface DialogConfirmSlots {
    body?: Slot | string;
    footer?: Slot | string;
}

export type DialogConfirmEmits = {
  'close': [];
  'confirm': [];
  'hide': [];
  'update:visible': [state: boolean];
};

export type DialogConfirmState = DialogConfirmProps & {
  visible: boolean;
};
