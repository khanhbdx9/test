import { OrderStatus } from '../../../generated/prisma/client';
export declare class ReportSummaryDto {
    totalRevenue: string;
    totalOrders: number;
    completedOrders: number;
    averageOrderValue: string;
}
export declare class OrdersByStatusDto {
    status: OrderStatus;
    count: number;
}
export declare class RevenueByDayDto {
    date: string;
    revenue: string;
    orders: number;
}
export declare class RevenueByMonthDto {
    month: string;
    revenue: string;
    orders: number;
}
export declare class TopProductDto {
    productId: string;
    productName: string;
    productSku: string;
    quantity: number;
    revenue: string;
}
export declare class ReportDashboardDto {
    summary: ReportSummaryDto;
    ordersByStatus: OrdersByStatusDto[];
    revenueByDay: RevenueByDayDto[];
    revenueByMonth: RevenueByMonthDto[];
    topProducts: TopProductDto[];
}
