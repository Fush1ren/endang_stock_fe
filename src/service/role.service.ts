import type { AxiosResponse } from "axios";
import API from "./api.service";
import type { APIResponse, BasicAPIResponse, FetchListResponse } from "@/types/api.type";
import type { BodyUpdateCreateRole, Role, RoleDropdown } from "@/types/role.type";
import type { QueryParams } from "@/components/datatable/DataTable.vue.d";
import type { BodyDeleteData } from "@/types/data.type";

const RoleService = {
    getRole: (params: QueryParams): Promise<AxiosResponse<FetchListResponse<Role>>> => {
        return API.get('role' , { params });
    },

    getRoleById: (id: number): Promise<AxiosResponse<APIResponse<Role>>> => {
        return API.get(`role/${id}`);
    },

    createRole: (body: BodyUpdateCreateRole): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.post('role', body);
    },

    updateRole: (id: number, body: BodyUpdateCreateRole): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.put(`role/${id}`, body);
    },

    deleteRole: (body: BodyDeleteData): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.delete('role', { data: body });
    },

    getRoleDropdown: (): Promise<AxiosResponse<APIResponse<RoleDropdown[]>>> => {
        return API.get('role/dropdown');
    }
}

export default RoleService;