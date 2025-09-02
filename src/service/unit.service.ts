import type { AxiosResponse } from "axios";
import API from "./api.service";
import type { APIResponse, BasicAPIResponse, FetchListResponse } from "@/types/api.type";
import type { BodyCreateUnit, BodyUpdateUnit, UnitProduct } from "@/types/product.type";
import type { QueryParams } from "@/components/datatable/DataTable.vue.d";
import type { BodyDeleteData, DropdownValue } from "@/types/data.type";

const UnitService = {
    getUnit: (params: QueryParams): Promise<AxiosResponse<FetchListResponse<UnitProduct>>> => {
        return API.get("unit" , { params });
    },
    
    createUnit: (body: BodyCreateUnit) : Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.post("unit", body);
    },

    editUnit: (id: number, body: BodyUpdateUnit): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.put(`unit/${id}`, body);
    },

    deleteUnit: (body: BodyDeleteData): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.delete('unit', { data: body });
    },

    getUnitDropdown: (): Promise<AxiosResponse<APIResponse<DropdownValue[]>>> => {
        return API.get('unit/dropdown');
    }
}

export default UnitService;