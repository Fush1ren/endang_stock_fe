import type { Nullable } from "@/utils";
import type { InputHTMLAttributes, Slot } from "vue";

export interface InputTextProps extends /* @vue-ignore */ InputHTMLAttributes {
    autoUppercase?: boolean;

    modelValue?: Nullable<string>;

    placeholder?: string;

    value?: string;

    maxLength?: number;
    
    label?: string;

    mandatory?: boolean;

    optional?: boolean;

    type?: 'email' | 'text' | 'url';

    disabled?: boolean;

    inputClass?: string;

    inputContainerClass?: string;

    labelClass?: string;

    useInputGroup?: boolean;

    inputId?: string;

    preventInputOnMaxLength?: boolean;

    unstyled?: boolean;
}

export type InputTextEmits = {
    'update:modelValue': [value: string | undefined];
    'blur': [params?: Nullable<string>];
    'input': [params?: Nullable<string>];
}

export type InputTextSlots = {
    'slot-left': Slot;
    'slot-right': Slot;
};
  