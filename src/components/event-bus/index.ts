import type { UserProfile } from "@/types/user.type";
import type { Data, QueryParams } from "../datatable/DataTable.vue.d";
import emitt, { type Emitter } from "./utils";

export type TableEvent = {
    tableName?: string;
}

export type Events<ECustom = Record<string, any>> = ECustom & {
    'data-table:apply-filters': TableEvent & {
        filter: QueryParams;
    };

    'search-table': TableEvent & {
        search: string | undefined;
    };

    'show-filter': TableEvent & { show: boolean };

    'data-table:update': TableEvent;

    'data-table:download': TableEvent & {
        fileName: string;
    };

    'data-table:select-all-record': TableEvent;
    'data-table:update-total-record': TableEvent & { total: number };
    'data-table:update-selected-data': TableEvent & { data?: Data[] };
    'data-table:clear-selected-data': TableEvent;

    'data-table:import-excel-to-json': TableEvent & {
        data: Data[];
    };
    'data-user:update': UserProfile;
}

const eventBus = emitt<Events>();

export const extendEventBus = <T>(): Emitter<Events<T>> => {
    return eventBus as Emitter<Events<T>>;
};

export default eventBus;