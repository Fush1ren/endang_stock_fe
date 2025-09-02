export declare type ValueNull<T = void> = T | null | undefined;


export interface BodyDeleteData {
    id: number[];
}

export interface DropdownValue {
    id: number;
    name: string;
}

export type OptionsValue = {
    label: string;
    value: number | string;
}