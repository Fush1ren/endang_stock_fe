import type { AxiosResponse } from "axios";
import API from "./api.service";
import type { APIResponse, BasicAPIResponse, FetchListResponse } from "@/types/api.type";
import type { BodyCreateData, BodyUpdateBrand, Brand } from "@/types/product.type";
import type { QueryParams } from "@/components/datatable/DataTable.vue.d";
import type { BodyDeleteData, DropdownValue } from "@/types/data.type";

const BrandService = {
    getBrand: (params: QueryParams): Promise<AxiosResponse<FetchListResponse<Brand>>> => {
        return API.get('brand', { params });
    },

    createBrand: (body: BodyCreateData): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.post('brand', body);
    },

    updateBrand: (id: number, body: BodyUpdateBrand): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.put(`brand/${id}`, body);
    },

    deleteBrand: (body: BodyDeleteData): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.delete('brand', { data: body });
    },
    
    getBrandDropdown: (): Promise<AxiosResponse<APIResponse<DropdownValue[]>>> => {
        return API.get('brand/dropdown');
    }
}

export default BrandService;