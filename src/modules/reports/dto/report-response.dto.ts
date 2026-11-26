import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../../generated/prisma/client';

export class ReportSummaryDto {
  @ApiProperty({ example: '1500000.00', description: 'Doanh thu đơn COMPLETED' })
  totalRevenue!: string;

  @ApiProperty({ description: 'Tổng số đơn trong khoảng (mọi status)' })
  totalOrders!: number;

  @ApiProperty({ description: 'Số đơn COMPLETED' })
  completedOrders!: number;

  @ApiProperty({
    example: '750000.00',
    description: 'Doanh thu trung bình / đơn COMPLETED',
  })
  averageOrderValue!: string;
}

export class OrdersByStatusDto {
  @ApiProperty({ enum: OrderStatus })
  status!: OrderStatus;

  @ApiProperty()
  count!: number;
}

export class RevenueByDayDto {
  @ApiProperty({ example: '2026-11-24' })
  date!: string;

  @ApiProperty({ example: '450000.00' })
  revenue!: string;

  @ApiProperty()
  orders!: number;
}

export class RevenueByMonthDto {
  @ApiProperty({ example: '2026-11' })
  month!: string;

  @ApiProperty({ example: '1500000.00' })
  revenue!: string;

  @ApiProperty()
  orders!: number;
}

export class TopProductDto {
  @ApiProperty()
  productId!: string;

  @ApiProperty()
  productName!: string;

  @ApiProperty()
  productSku!: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty({ example: '900000.00' })
  revenue!: string;
}

export class ReportDashboardDto {
  @ApiProperty({ type: ReportSummaryDto })
  summary!: ReportSummaryDto;

  @ApiProperty({ type: [OrdersByStatusDto] })
  ordersByStatus!: OrdersByStatusDto[];

  @ApiProperty({ type: [RevenueByDayDto] })
  revenueByDay!: RevenueByDayDto[];

  @ApiProperty({ type: [RevenueByMonthDto] })
  revenueByMonth!: RevenueByMonthDto[];

  @ApiProperty({ type: [TopProductDto] })
  topProducts!: TopProductDto[];
}
