import type { Permissions } from "./login.type";

export type Role = {
    id: number;
    name: string;
    permissions: Permissions;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export type RoleDropdown = {
    id: number;
    name: string;
}

export type BodyUpdateCreateRole = {
    name: string;
    permissions: Permissions;
}
