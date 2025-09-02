import type { FileUpload } from "primevue";

export interface FileUploadProps {
    label?: string;
    url?: string | null;
    mandatory?: boolean;
}

export interface FileUploadEmits {
    'upload': [File];
}

export type InterfaceFileUpload = InstanceType<typeof FileUpload> & HTMLInputElement;