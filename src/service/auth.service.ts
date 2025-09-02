import type { AxiosResponse } from "axios";
import type { BodyLogin, LoginResponse } from "@/types/login.type";
import type { APIResponse } from "@/types/api.type";

import config from "@/config";
import axios from "axios";

const BASE_URL = config.apiURL!;

const API = axios.create({
  baseURL: `${BASE_URL}/api/v1/`,
  headers: {
    "Content-Type": "application/json",
  },
});


const AuthService = {
    login: (body: BodyLogin): Promise<AxiosResponse<APIResponse<LoginResponse>>> => {
        return API.post("auth/login", body);
    },
}

export default AuthService;