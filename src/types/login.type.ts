export type LoginResponse = {
    id: number;
    username: string;
    name: string;
    email: string;
    photo: string | null;
    role: {
        id: number;
        name: string;
    };
    permissions: Record<StockRoleAttribute, PermissionType>;
    accessToken: string;
    refreshToken: string;
}

export type BodyLogin = {
    identifier: string;
    password: string;
}

export type StockRoleAttribute = 'brand' | 'category' | 'product' | 'unit' |
'product_in' | 'product_out' | 'product_mutation' |
'store' | 'store_stock' | 'warehouse_stock' |
'setting_user' | 'setting_role';

export interface PermissionType {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
}

export interface Permissions {
    product: PermissionType;
    brand: PermissionType;
    category: PermissionType;
    unit: PermissionType;
    product_in: PermissionType;
    product_out: PermissionType;
    product_mutation: PermissionType;
    store: PermissionType;
    store_stock: PermissionType;
    warehouse_stock: PermissionType;
    setting_user: PermissionType;
    setting_role: PermissionType;
}