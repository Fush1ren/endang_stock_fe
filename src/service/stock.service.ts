import type { AxiosResponse } from "axios";
import API from "./api.service";
import type { APIResponse, BasicAPIResponse, FetchListResponse } from "@/types/api.type";
import type { BodyCreateStockIn, BodyCreateStockMutation, BodyCreateStockOut, BodyUpdateStock, ParamsStoreStockOptions, ParamsWarehouseStockOptions, StockIn, StockInIndex, StockInReport, StockMutation, StockMutationIndex, StockMutationReport, StockOut, StockOutIndex, StockOutReport, StockWarehouse, StockWareHouseDropdown, StoreStockOptions, WareHouseStockOptions } from "@/types/stock.type";
import type { QueryParams } from "@/components/datatable/DataTable.vue.d";

const StockService = {
    getWarehouseStock: (params: QueryParams): Promise<AxiosResponse<FetchListResponse<StockWarehouse>>> => {
        return API.get('stock/warehouse' , { params });
    },

    getWarehouseOptions: (params: ParamsWarehouseStockOptions): Promise<AxiosResponse<APIResponse<WareHouseStockOptions>>> => {
        return API.get('stock/warehouse/options' , { params });
    },

    getWarehouseStockDropdown: (): Promise<AxiosResponse<APIResponse<StockWareHouseDropdown[]>>> => {
        return API.get('stock/warehouse/dropdown');
    },

    getStockIn: (params: QueryParams): Promise<AxiosResponse<FetchListResponse<StockIn>>> => {
        return API.get('stock/in' , { params });
    },

    getStockInReport: (params: QueryParams): Promise<AxiosResponse<FetchListResponse<StockInReport>>> => {
        return API.get('stock/in/report' , { params });
    },

    getStockOutReport: (params: QueryParams): Promise<AxiosResponse<FetchListResponse<StockOutReport>>> => {
        return API.get('stock/out/report' , { params });
    },

    getStockMutationReport: (params: QueryParams): Promise<AxiosResponse<FetchListResponse<StockMutationReport>>> => {
        return API.get('stock/mutation/report' , { params });
    },

    getStockOut: (params: QueryParams): Promise<AxiosResponse<FetchListResponse<StockOut>>> => {
        return API.get('stock/out' , { params });
    },

    getStockMutation: (params: QueryParams): Promise<AxiosResponse<FetchListResponse<StockMutation>>> => {
        return API.get('stock/mutation' , { params });
    },
    
    getStockInIndex: (): Promise<AxiosResponse<APIResponse<StockInIndex>>> => {
        return API.get('stock/in/next-index');
    },

    getStockOutIndex: (): Promise<AxiosResponse<APIResponse<StockOutIndex>>> => {
        return API.get('stock/out/next-index');
    },

    getStockMutationIndex: (): Promise<AxiosResponse<APIResponse<StockMutationIndex>>> => {
        return API.get('stock/mutation/next-index');
    },

    getStoreStockById: (storeId: number): Promise<AxiosResponse<APIResponse<StockWarehouse[]>>> => {
        return API.get(`stock/store/${storeId}`);
    },

    getStoreStockOptionsById: (storeId: number, params: ParamsStoreStockOptions): Promise<AxiosResponse<APIResponse<StoreStockOptions>>> => {
        return API.get(`stock/store/stock/${storeId}/options` , { params });
    },

    getStoreStockList: (params: QueryParams, id: number): Promise<AxiosResponse<FetchListResponse<StockWarehouse>>> => {
        return API.get(`stock/store/stock/${id}` , { params });
    },

    getStockInById: (id: number): Promise<AxiosResponse<APIResponse<StockIn>>> => {
        return API.get(`stock/in/${id}`);
    },

    getStockOutById: (id: number): Promise<AxiosResponse<APIResponse<StockOut>>> => {
        return API.get(`stock/out/${id}`);
    },

    getStockMutationById: (id: number): Promise<AxiosResponse<APIResponse<StockMutation>>> => {
        return API.get(`stock/mutation/${id}`);
    },

    postStockIn: (body: BodyCreateStockIn): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.post('stock/in', body);
    },

    postStockOut: (body: BodyCreateStockOut): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.post('stock/out', body);
    },

    postStockMutation: (body: BodyCreateStockMutation): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.post('stock/mutation', body);
    },

    patchStockIn: (id: number): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.patch(`stock/in/${id}`);
    },

    patchStockOut: (id: number): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.patch(`stock/out/${id}`);
    },

    patchStockMutation: (id: number): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.patch(`stock/mutation/${id}`);
    },

    updateStockIn: (id: number, body: BodyUpdateStock): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.put(`stock/in/${id}`, body);
    },

    updateStockOut: (id: number, body: BodyUpdateStock): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.put(`stock/out/${id}`, body);
    },

    updateStockMutation: (id: number, body: BodyUpdateStock): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.put(`stock/mutation/${id}`, body);
    },

    deleteStockIn: (id: number): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.delete(`stock/in/${id}`);
    },

    deleteStockOut: (id: number): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.delete(`stock/out/${id}`);
    },

    deleteStockMutation: (id: number): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.delete(`stock/mutation/${id}`);
    },
}

export default StockService;