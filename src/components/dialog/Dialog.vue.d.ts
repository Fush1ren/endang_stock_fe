import type { DialogEmitsOptions } from "primevue";
import type { VNode } from "vue";

export interface DialogProps {
    header?: string;
    visible?: boolean;
    closable?: boolean;
    draggable?: boolean;
    unstyled?: boolean;
    pt?: any;
    class?: string;
    style?: string;
    stay?: boolean;
    useSubmit?: boolean;
    useClose?: boolean;
    useStay?: boolean;
}

export interface DialogSlots {
    default(): VNode[];
}

export interface DialogEmits {
    'update:visible': [visible: boolean];
    'submit': [payload: { event: PointerEvent | Event, stay: boolean }];
    'close': [event: Event];
}

export interface DialogPayload {
    event: Event;
    stay: boolean;
}

export type DialogState = {
  visible: boolean;
  type: 'add' | 'edit';
  header: string;
  useStay?: boolean;
};