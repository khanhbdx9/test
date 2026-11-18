export declare class BannerResponseDto {
    id: string;
    title: string;
    desktopImageUrl: string;
    mobileImageUrl: string | null;
    link: string | null;
    position: string;
    sortOrder: number;
    startsAt: Date | null;
    endsAt: Date | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class DeletedBannerResponseDto {
    id: string;
}
