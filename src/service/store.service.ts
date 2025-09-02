import type { AxiosResponse } from "axios";
import API from "./api.service";
import type { APIResponse, BasicAPIResponse, FetchListResponse } from "@/types/api.type";
import type { BodyCreateStore, BodyUpdateStore, Store } from "@/types/store.type";
import type { BodyDeleteData, DropdownValue } from "@/types/data.type";
import type { QueryParams } from "@/components/datatable/DataTable.vue.d";

const StoreService = {
    getStore: (params: QueryParams): Promise<AxiosResponse<FetchListResponse<Store>>> => {
        return API.get("store" , { params });
    },

    getStoreById: (id: number): Promise<AxiosResponse<APIResponse<Store>>> => {
        return API.get(`store/${id}`);
    },

    createStore: (body: BodyCreateStore): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.post("store", body);
    },

    updateStore: (id: number, body: BodyUpdateStore): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.put(`store/${id}`, body);
    },

    deleteStore: (body: BodyDeleteData): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.delete('store', { data: body });
    },

    getStoreDropdown: (): Promise<AxiosResponse<APIResponse<DropdownValue[]>>> => {
        return API.get("store/dropdown");
    }
}

export default StoreService;