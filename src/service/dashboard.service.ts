import type { APIResponse, FetchListResponse } from "@/types/api.type";
import type { AxiosResponse } from "axios";
import API from "./api.service";
import type { DashboardChartData, DashboardLowStockData, DashboardTotalData } from "@/types/dashboard.type";

const DashboardService = {
    getDashboardTotalData: (): Promise<AxiosResponse<APIResponse<DashboardTotalData>>> => {
        return API.get('dashboard/total-data');
    },

    getDashboardLowStockData: (): Promise<AxiosResponse<FetchListResponse<DashboardLowStockData[]>>> => {
        return API.get('dashboard/low-stock');
    },

    getDashboardChartDataProductIn: (params: {year: number }): Promise<AxiosResponse<APIResponse<DashboardChartData>>> => {
        return API.get('dashboard/chart/stock-in', { params });
    },
    getDashboardChartDataProductOut: (params: {year: number }): Promise<AxiosResponse<APIResponse<DashboardChartData>>> => {
        return API.get('dashboard/chart/stock-out', { params });
    },
    getDashboardChartDataProductMutation: (params: {year: number }): Promise<AxiosResponse<APIResponse<DashboardChartData>>> => {
        return API.get('dashboard/chart/stock-mutation', { params });
    }
}

export default DashboardService;