export type ImageType = 'profile' | 'default';

export interface ImageProps {
    src: string;
    class?: string;
    type?: ImageType;
    preview?: boolean;
}