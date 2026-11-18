export declare class CreateThemeDto {
    name: string;
    code: string;
    description?: string;
    config: Record<string, unknown>;
    previewUrl?: string | null;
    isActive?: boolean;
}
