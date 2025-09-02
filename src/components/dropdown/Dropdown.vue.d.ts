import type { Icons } from "../icons/Icons.vue";

export type OptionValue = string | number | boolean | Record<string, any>;

export type DropdownOption = {
  name: string;
  id: number;
  [key: string]: any;
};


export interface DropdownProps {
    modelValue?: OptionValue;

    initialValue?: OptionValue;

    label?: string;

    options?: DropdownOption[];

    placeholder?: string;
    loading?: boolean;
    disabled?: boolean;
    disabledInput?: boolean;
    disabledButton?: boolean;
}

// export interface DropdownEmits {
//     (event: 'hide', value: DropdownOption): void;
// }

export interface DropdownEmits {
  open(): void;
  hide(): void;
}