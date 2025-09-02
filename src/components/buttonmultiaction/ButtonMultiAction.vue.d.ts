import type { MenuItem } from "primevue/menuitem";

export interface ButtonMultiActionProps {
    options?: MenuItem[];
    class?: any;
    selectedData: Record<string, any>[];
    tableName?: string;
    totalRecords?: number;
}

export type ButtonMultiActionEmits = {
    'update:selectedData': [datas: Record<string, unknown>[]];
}