import type { AxiosResponse } from "axios";
import API from "./api.service";
import type { APIResponse, BasicAPIResponse, FetchListResponse } from "@/types/api.type";
import type { QueryParams } from "@/components/datatable/DataTable.vue.d";
import type { BodyCreateProduct, BodyUpdateProduct, BodyUpdateThreshold, ParamsProductOptions, Product, ProductNextIndex, ProductOptions } from "@/types/product.type";
import type { BodyDeleteData, DropdownValue } from "@/types/data.type";

const ProductService = {
    getProduct: (params: QueryParams): Promise<AxiosResponse<FetchListResponse<Product>>> => {
        return API.get("product" , { params });
    },

    getProductOption: (params: ParamsProductOptions): Promise<AxiosResponse<APIResponse<ProductOptions>>> => {
        return API.get("product/options" , { params });
    },

    getProductDetail: (id: number): Promise<AxiosResponse<APIResponse<Product>>> => {
        return API.get(`product/${id}`);
    },

    createProduct: (body: BodyCreateProduct): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.post("product", body);
    },

    updateProduct: (id: number, body: BodyUpdateProduct): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.put(`product/${id}`, body);
    },

    updateThreshold: (id: number, body: BodyUpdateThreshold): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.patch(`product/${id}/threshold`, body);
    },

    deleteProduct: (body: BodyDeleteData): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.delete('product', { data: body });
    },

    getProductIndex: (): Promise<AxiosResponse<APIResponse<ProductNextIndex>>> => {
        return API.get('product/next-index');
    },

    getProductDropdown: (): Promise<AxiosResponse<APIResponse<DropdownValue[]>>> => {
        return API.get("product/dropdown");
    }
}

export default ProductService;