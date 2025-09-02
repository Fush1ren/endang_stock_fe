import type { LoginResponse, Permissions, PermissionType } from "@/types/login.type";

export const getStorage = (): boolean => {
    const user = localStorage.getItem('user');
    return user ? true : false;
}

export const getStockAppPermission = (
     name: keyof LoginResponse['permissions'],
): PermissionType => {
    const { permissions }: LoginResponse = JSON.parse(localStorage.getItem('user') ?? '{}');

    return (
        permissions?.[name] ?? {
            create: false,
            delete: false,
            update: false,
            view: false,
        }
    )
};

export const getPermission = (): Permissions => {
    const { permissions } = JSON.parse(localStorage.getItem('user') ?? '{}');
    return permissions; 
}

export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const setAccessToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem('refreshToken', token);
}

export const clearUser = (): void => {
  localStorage.removeItem('user');
}

export const clearSession = (): void => {
  sessionStorage.clear();
};

export const clearAccessToken = (): void => {
  localStorage.removeItem('accessToken');
};

export const clearRefreshToken = (): void => {
  localStorage.removeItem('refreshToken');
};