import type { HintedString } from "@primevue/core";
import type { OptionValue } from "../dropdown/Dropdown.vue";

type FieldValue =
  | Nullable<string>
  | Nullable<number>
  | string
  | string[]
  | number
  | number[]
  | boolean
  | undefined
  | null
  | object;


export type FieldValues<T = FieldValue | undefined> = {
    value: T;
}

export interface MultiSelectOption {
    label: string;
    value: string | number;
}

export interface MultiSelectProps {
    modelValue?: OptionValue[];

    defaultValue?: MultiSelectOption[];
    label?: string | undefined;
    mandatory?: boolean | undefined;
    optional?: boolean | undefined;
    name?: string | undefined;
    placeholder?: string | undefined;
    options?: MultiSelectOption[] | string[];
    display?: HintedString<'comma' | 'chip'> | undefined;
    maxSelectedLabels?: number | undefined;
    filter?: boolean | undefined;
    optionLabel?: string | undefined;
    optionValue?: string | undefined;
}

export interface MultiSelectEmits {
    show(): void;
    hide(): void;
    'update:modelValue': [value: OptionValue[] | undefined];
}