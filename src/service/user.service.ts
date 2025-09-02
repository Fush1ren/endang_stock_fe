import type { APIResponse, BasicAPIResponse, FetchListResponse } from "@/types/api.type";
import API from "./api.service";
import type { BodyAddUpdateUser, BodyUpdateUserProfile, ParamsUserOptions, UserDetail, UserList, UserOptions, UserProfile } from "@/types/user.type";
import type { AxiosResponse } from "axios";
import type { QueryParams } from "@/components/datatable/DataTable.vue.d";
import type { BodyDeleteData } from "@/types/data.type";

const UserService = {
    getUserList: (params: QueryParams): Promise<AxiosResponse<FetchListResponse<UserList>>> => {
        return API.get("user" , { params });
    },

    getUserOptions: (params: ParamsUserOptions): Promise<AxiosResponse<APIResponse<UserOptions>>> => {
        return API.get('user/options' , { params });
    },
    
    getUserDetail: (id: number): Promise<AxiosResponse<APIResponse<UserDetail>>> => {
        return API.get(`user/${id}`);
    },

    createUser: (body: BodyAddUpdateUser): Promise<AxiosResponse<BasicAPIResponse>> => {
        const headers = { 'Content-Type': 'multipart/form-data' };
        return API.post('user', body , { headers });
    },

    updateUser: (id: number, body: BodyAddUpdateUser): Promise<AxiosResponse<BasicAPIResponse>> => {
        const headers = { 'Content-Type': 'multipart/form-data' };
        return API.put(`user/${id}`, body, { headers });
    },

    deleteUser: (body: BodyDeleteData): Promise<AxiosResponse<BasicAPIResponse>> => {
        return API.delete('user', { data: body });
    },

    getProfile: (id: number): Promise<AxiosResponse<APIResponse<UserProfile>>> => {
        return API.get(`user/profile/${id}`);
    },

    updateProfile: (id: number, body: BodyUpdateUserProfile): Promise<AxiosResponse<BasicAPIResponse>> => {
        const headers = { 'Content-Type': 'multipart/form-data' };
        return API.put(`user/profile/${id}`, body , { headers });
    },
}

export default UserService;