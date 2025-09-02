export type UserType = {
    id: number;
    username: string;
    email: string;
    name: string;
    photo: string;
    role: {
        id: number;
        name: string;
    };
    accessToken: string;
    refreshToken: string;
}