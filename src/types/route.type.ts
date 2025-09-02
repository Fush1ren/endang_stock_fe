export type RouteType = {
    name: string;
    route: string;
}

export enum MainRouteNameList {
    DASHBOARD = 'Dashboard',
    PRODUCT = 'Produk',
    STOCK_MANAGEMENT= 'Manajemen Stok',
    STORE= 'Toko',
    WAREHOUSE= 'Gudang',
    REPORT= 'Laporan',
    SETTINGS= 'Pengaturan',
}

// export type MainRoute = Record<MainRouteNameList, Omit>; 