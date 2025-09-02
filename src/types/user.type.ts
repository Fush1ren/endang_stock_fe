import type { OptionsValue } from "./data.type";

export type UserList = {
    id: number;
    username: string;
    name: string;
    email: string;
    photo: string | null;
    roles: {
        id: number;
        name: string;
    };
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface ParamsUserOptions {
    role?: string;
}

export interface UserOptions {
    role: OptionsValue[];
}


export interface UserDetail {
    id: number;
    username: string;
    name: string;
    email: string;
    photo: string | null;
    roles: {
        id: number;
        name: string;
    };
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface BodyAddUpdateUser {
    name: string;
    username: string;
    email: string;
    password: string;
    photo?: File | null;
    role: number;
}

export interface BodyUpdateUserProfile {
    name: string;
    username: string;
    email: string;
    password?: string;
    photo?: File | null;
}

export interface UserProfile {
    id: number;
    username: string;
    name: string;
    email: string;
    photo: string | null;
    roles: {
        id: number;
        name: string;
    };
}

export interface AuthUser {
    isAuthenticated: boolean
    login: () => void
    logout: () => void
}