import type { HintedString } from "@primevue/core";
import type { ValueNull } from "@/types/data.type";

export interface InputNumberProps {
    modelValue?: ValueNull<number>;
    defaultValue?: ValueNull<number>;
    mode?: HintedString<"decimal" | "currency">;
    prefix?: string | null;
    suffix?: string | null;
    /**
     *  The currency to use in currency formatting. 
     *  Possible values are the [ISO 4217 currency codes]
     *  (https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=maintenance-agency), 
     *  such as 'USD' for the US dollar, 'EUR' for the euro, or 'CNY' for the Chinese RMB.
        There is no default value; if the style is 'currency', the currency property must be provided.
     */
    currency?: string | null;
    /**
     *  How to display the currency in currency formatting. 
     *  Possible values are 'symbol' to use a localized currency symbol such as €, 
     *  'code' to use the ISO currency code, 'name' to use a localized currency name such as 'dollar'.
     */
    currencyDisplay?: string;
    useGrouping?: boolean;
    minFractionDigits?: number | null;
    maxFractionDigits?: number | null;
    min?: number | null;
    max?: number | null;
    size?: HintedString<"small" | "large">;
    disabled?: boolean;
    inputClass?: string | null;
    fluid?: boolean;
    inputId?: string | null;
    useInputGroup?: boolean;
    unstyled?: boolean;
    placeholder?: string;
    label?: string;
    labelClass?: string;
    mandatory?: boolean;
    optional?: boolean;
    inputContainerClass?: string;
}

export interface InputNumberEmits {
    'update:modelValue'(value: number): void;
    input(event: InputNumberInputEvent): void;
}