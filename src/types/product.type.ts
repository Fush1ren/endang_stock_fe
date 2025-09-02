import type { OptionsValue } from "./data.type";

export type ProductCategory = {
    id: number;
    name: string;
    user: {
        id: string;
        name: string;
        username: string;
    };
    updatedAt: string | Date;
    createdAt: string | Date;
}

export type UnitProduct = {
    id: number;
    name: string;
    user: {
        id: string;
        name: string;
    };
    updatedAt: string | Date;
    createdAt: string | Date;
}

export type Brand = {
    id: number;
    name: string;
    user: {
        id: string;
        name: string;
    };
    updatedAt: string | Date;
    createdAt: string | Date;
}

export type Product = {
    id: number;
    name: string;
    code: string;
    description: string;
    threshold: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    category: {
        id: number;
        name: string;
    };
    unit: {
        id: number;
        name: string;
    };
    brand: {
        id: number;
        name: string;
    };
    createdBy: {
        id: number;
        name: string;
    }
    updatedBy: {
        id: number;
        name: string;
    };
}

export interface BodyCreateProduct {
    name: string;
    code: string;
    description?: string;
    brandId: number;
    categoryId: number;
    unitId: number;
}

export type BodyUpdateProduct = BodyCreateProduct;

export interface BodyCreateUnit {
    name: string;
}

export interface BodyCreateData {
    name: string;
}

export interface BodyCreateCategory {
    name: string;
}

export interface ProductNextIndex {
    nextIndex: number;
}

export interface BodyUpdateThreshold {
    threshold: number;
}

export type BodyUpdateCategory = BodyCreateCategory;

export type BodyUpdateBrand = BodyCreateData;

export type BodyUpdateUnit = BodyCreateUnit;

export interface ParamsProductOptions {
    brand?: string;
    category?: string;
    unit?: string;
}

export interface ProductOptions {
    brand: OptionsValue[];
    category: OptionsValue[];
    unit: OptionsValue[];
}