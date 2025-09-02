export type Store = {
    id: number;
    name: string;
    updatedAt: string | Date;
    createdAt: string | Date;
    user: {
        id: number;
        name: string;
        username: string;
    }
}

export interface BodyCreateStore {
    name: string;
}

export interface BodyUpdateStore {
    name: string;
}

