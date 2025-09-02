import type { OptionsValue } from "./data.type";

export interface StockInIndex {
    nextCode: number;
};

export type StockOutIndex = StockInIndex;

export type StockMutationIndex = StockInIndex;

export interface ProductStockDetail {
    quantity: number;
    code: string;
    id: number;
    name: string;
}

export type ProductsStockAction = Omit<ProductStockDetail, 'id' | 'name' | 'code'> & {
    productId: number;
    quantity: number;
}

export interface BodyCreateStockIn {
    transactionCode: string;
    date: Date | string;
    toWarehouse: boolean;
    storeId: number;
    products: ProductsStockAction[];
}

export interface StockIn {
    id: number;
    transactionCode: string;
    date: string | Date;
    status: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    toWarehouse: boolean;
    toStore: {
        id: number;
        name: string;
    } | null;
    user: {
        id: number;
        name: string;
    }
    products: ProductStockDetail[];
}

export interface StockInReport {
    id: number;
    transactionCode: string;
    date: string | Date;
    toStore: string;
    products: ProductStockDetail[];
}

export interface StockOutReport {
    id: number;
    transactionCode: string;
    date: string | Date;
    fromStore: string;
    products: ProductStockDetail[];
}

export interface StockMutationReport {
    id: number;
    transactionCode: string;
    date: string | Date;
    fromStore: string;
    toStore: string;
    products: ProductStockDetail[];
}

export interface StockWarehouse {
    id: number;
    quantity: number;
    status: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    product: {
        id: number;
        name: string;
        brand: {
            id: number;
            name: string;
        }
    };
}

export interface StockWareHouseDropdown {
    id: number;
    name: string;
    quantity: number;
}

export interface StockOut {
    id: number;
    transactionCode: string;
    status: string;
    date: string | Date;
    createdAt: string | Date;
    updatedAt: string | Date;
    fromStore: {
        id: number;
        name: string;
    };
    user: {
        id: number;
        name: string;
    }
    products: ProductStockDetail[];
}

export interface StockMutation {
    id: number;
    transactionCode: string;
    status: string;
    date: string | Date;
    createdAt: string | Date;
    updatedAt: string | Date;
    fromWarehouse: boolean;
    fromStore: {
        id_store: number;
        name: string;
    } | null;
    toStore: {
        id: number;
        name: string;
    } | null;
    user: {
        id: number;
        name: string;
    }
    products: ProductStockDetail[];
}

export interface BodyCreateStockOut {
    transactionCode: string;
    date: Date | string;
    storeId: number;
    products: ProductsStockAction[];
}

export interface BodyCreateStockMutation {
    transactionCode: string;
    date: Date | string;
    fromWarehouse: boolean;
    fromStoreId: number | null;
    toStoreId: number;
    products: ProductsStockAction[];
}

export interface NotificationData {
    status: "available" | "lowStock" | "outOfStock";
    store?: { name: string };
    product: { name: string };
    location?: string;
}

export interface StockNotification {
    length: number;
    data: NotificationData[];
    lowStock: {
        productName: string;
        quantity: number;
        location: string;
    }[];
    outOfStock: {
        productName: string;
        location: string;
    }[];
}

export interface ParamsWarehouseStockOptions {
    brand?: string;
    product?: string;
}

export interface ParamsStoreStockOptions {
    brand?: string;
    product?: string;
}

export interface WareHouseStockOptions {
    brand: OptionsValue[];
    product: OptionsValue[];
}

export interface StoreStockOptions {
    brand: OptionsValue[];
    product: OptionsValue[];
}

export interface BodyUpdateStock {
    date: Date | string;
    products: {
        id: number;
        quantity: number;
    }[];
}