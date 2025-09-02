import type { pt } from "@/utils/object.utils";
// import type { PassThrough } from "@primevue/core";
import type { CheckboxPassThroughOptions } from "primevue";

export interface CheckboxProps {
    label?: string;
    modelValue?: any;
    defaultValue?: any;
    binary?: boolean;
    selectable?: boolean;
    pt?: pt<CheckboxPassThroughOptions>;
    value?: any;
}
