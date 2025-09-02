import type { AxiosResponse } from "axios";
import type { APIResponse, BasicAPIResponse, FetchListResponse } from "@/types/api.type";
import type { BodyCreateCategory, BodyUpdateCategory, ProductCategory } from "@/types/product.type";
import type { QueryParams } from "@/components/datatable/DataTable.vue.d";
import API from "./api.service";
import type { BodyDeleteData, DropdownValue } from "@/types/data.type";

const CategoryService = {
    getCategory: (params: QueryParams): Promise<AxiosResponse<FetchListResponse<ProductCategory>>> => {
        return API.get('category', { params });
    },

    createCategory: (body: BodyCreateCategory): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.post('category', body);
    },

    editCategory: (id: number, body: BodyUpdateCategory): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.put(`category/${id}`, body);
    },

    deleteCategory: (body: BodyDeleteData): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.delete('category', { data: body });
    },

    getCategoryDropdown: (): Promise<AxiosResponse<APIResponse<DropdownValue[]>>> => {
        return API.get('category/dropdown');
    }
}

export default CategoryService;