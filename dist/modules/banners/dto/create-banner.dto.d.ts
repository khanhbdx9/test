export declare class CreateBannerDto {
    title: string;
    desktopImageUrl: string;
    mobileImageUrl?: string | null;
    link?: string | null;
    position: string;
    sortOrder?: number;
    startsAt?: string | null;
    endsAt?: string | null;
    isActive?: boolean;
}
