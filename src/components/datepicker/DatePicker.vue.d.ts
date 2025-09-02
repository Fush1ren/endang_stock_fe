import type { DatePickerResponsiveOptions } from "primevue";

export type HintedString<T extends string> = (string & {}) | T;

export type DatePicketValue = Date | Date[] | (Date | null)[];


export interface DatePickerProps {
    modelValue?: null | DatePicketValue;
    defaultValue?: DatePicketValue;
    name?: string | null;
    label?: string;
    labelClass?: string;
    mandatory?: boolean;
    optional?: boolean;
    selectionMode?: HintedString<"single" | "multiple" | "range">;
    dateFormat?: string;
    inline?: boolean;
    showOtherMonths?: boolean;
    selectOtherMonths?: boolean;
    showIcon?: boolean;
    iconDisplay?: HintedString<"button" | "input">;
    icon?: string;
    prevIcon?: string;
    nextIcon?: string;
    incrementIcon?: string;
    decrementIcon?: string;
    numberOfMonths?: number;
    responsiveOptions?: DatePickerResponsiveOptions[];
    breakpoint?: string;
    view?: HintedString<"month" | "year" | "date">;
    minDate?: Date | null;
    maxDate?: Date | null;
    disabledDates?: Date[] | null;
    disabledDays?: number[] | null;
    maxDateCount?: number;
    showOnFocus?: boolean;
    autoZIndex?: boolean;
    baseZIndex?: number;
    showButtonBar?: boolean;
    shortYearCutoff?: string;
    showTime?: boolean;
    fluid?: boolean;
    placeholder?: string;
}