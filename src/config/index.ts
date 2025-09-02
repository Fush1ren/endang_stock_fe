export interface ConfigEnv {
    apiURL: string;
    mode: string;
    initialImage: string;
    bucketUrl: string;
    salt: number;
}

const getURL = (): string => {
    if (import.meta.env.VITE_APP_MODE === 'development') {
        return import.meta.env.VITE_APP_API_URL_DEV!;
    }
    else if (import.meta.env.VITE_APP_MODE === 'production') {
        return import.meta.env.VITE_APP_API_URL_PROD!;
    }
    return '';
}

const config: ConfigEnv = {
    apiURL: getURL(),
    mode: import.meta.env.VITE_APP_MODE,
    initialImage: import.meta.env.VITE_APP_INITIAL_IMAGE_URL || '',
    bucketUrl: import.meta.env.VITE_APP_BUCKET_URL || '',
    salt: parseInt(import.meta.env.VITE_APP_SALT || '10', 10),
}

export default config;