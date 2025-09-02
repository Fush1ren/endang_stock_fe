import type { Data } from "@/components/datatable/DataTable.vue.d";
import { AxiosError } from "axios";

export type APIResponse<T = Data> = {
    status: number;
    message: string;
    data: T;
}

export type FetchListResponse<T = Data> = {
    status: number;
    message: string;
    data: {
        data: T[];
        totalRecords: number;
    };
}

export type BasicAPIResponse = {
    status: number;
    message: string;
}

export type ApiError = AxiosError<BasicAPIResponse>;