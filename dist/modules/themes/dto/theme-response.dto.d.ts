export declare class ThemeResponseDto {
    id: string;
    name: string;
    code: string;
    description: string | null;
    config: Record<string, unknown>;
    previewUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class DeletedThemeResponseDto {
    id: string;
}
