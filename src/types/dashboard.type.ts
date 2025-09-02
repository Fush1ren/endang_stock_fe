export interface DashboardTotalData {
    totalProducts: number;
    totalBrands: number;
    totalCategories: number;
    totalUnits: number;
    totalProductInCompleted: number;
    totalProductInPending: number;
    totalProductOutCompleted: number;
    totalProductOutPending: number;
    totalProductMutationCompleted: number;
    totalProductMutationPending: number;
    totalStores: number;
    totalWarehouseStocks: number;
    totalUsers: number;
    totalRoles: number;
}

export interface DashboardLowStockData {
    id: number;
    codeProduct: string;
    brand: string;
    productName: string;
    location: string;
    quantity: number;
}

export interface DashboardChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor?: string[];
        borderWidth?: number;
    }[];
}