import { BadRequestException, Injectable } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  OrderStatus,
  Prisma,
} from '../../generated/prisma/client';
import { QueryReportDto } from './dto/query-report.dto';
import { ReportDashboardDto } from './dto/report-response.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(query: QueryReportDto): Promise<ReportDashboardDto> {
    this.assertDateRange(query.from, query.to);
    const from = this.toDateOnly(query.from);
    const toExclusive = this.toExclusiveEndDate(query.to);
    const topLimit = query.topLimit ?? 10;

    const rangeWhere: Prisma.OrderWhereInput = {
      createdAt: { gte: from, lt: toExclusive },
    };
    const completedWhere: Prisma.OrderWhereInput = {
      ...rangeWhere,
      status: OrderStatus.COMPLETED,
    };

    const [statusGroups, completedOrders] = await Promise.all([
      this.prisma.order.groupBy({
        by: ['status'],
        where: rangeWhere,
        _count: { _all: true },
      }),
      this.prisma.order.findMany({
        where: completedWhere,
        select: {
          id: true,
          totalAmount: true,
          createdAt: true,
        },
      }),
    ]);

    const totalOrders = statusGroups.reduce(
      (sum, row) => sum + row._count._all,
      0,
    );
    const completedCount = completedOrders.length;
    let totalRevenue = new Prisma.Decimal(0);
    const byDay = new Map<string, { revenue: Prisma.Decimal; orders: number }>();
    const byMonth = new Map<
      string,
      { revenue: Prisma.Decimal; orders: number }
    >();

    for (const order of completedOrders) {
      totalRevenue = totalRevenue.add(order.totalAmount);
      const day = order.createdAt.toISOString().slice(0, 10);
      const month = day.slice(0, 7);
      const dayBucket = byDay.get(day) ?? {
        revenue: new Prisma.Decimal(0),
        orders: 0,
      };
      dayBucket.revenue = dayBucket.revenue.add(order.totalAmount);
      dayBucket.orders += 1;
      byDay.set(day, dayBucket);

      const monthBucket = byMonth.get(month) ?? {
        revenue: new Prisma.Decimal(0),
        orders: 0,
      };
      monthBucket.revenue = monthBucket.revenue.add(order.totalAmount);
      monthBucket.orders += 1;
      byMonth.set(month, monthBucket);
    }

    const averageOrderValue =
      completedCount === 0
        ? new Prisma.Decimal(0)
        : totalRevenue.div(completedCount);

    const completedIds = completedOrders.map((order) => order.id);
    const lineItems =
      completedIds.length === 0
        ? []
        : await this.prisma.orderItem.findMany({
            where: { orderId: { in: completedIds } },
            select: {
              productId: true,
              productName: true,
              productSku: true,
              quantity: true,
              unitPrice: true,
            },
          });

    const productAgg = new Map<
      string,
      {
        productId: string;
        productName: string;
        productSku: string;
        quantity: number;
        revenue: Prisma.Decimal;
      }
    >();
    for (const item of lineItems) {
      const current = productAgg.get(item.productId) ?? {
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        quantity: 0,
        revenue: new Prisma.Decimal(0),
      };
      current.quantity += item.quantity;
      current.revenue = current.revenue.add(item.unitPrice.mul(item.quantity));
      productAgg.set(item.productId, current);
    }

    const topProducts = [...productAgg.values()]
      .sort((a, b) => b.quantity - a.quantity || b.revenue.comparedTo(a.revenue))
      .slice(0, topLimit)
      .map((row) => ({
        productId: row.productId,
        productName: row.productName,
        productSku: row.productSku,
        quantity: row.quantity,
        revenue: row.revenue.toFixed(2),
      }));

    return {
      summary: {
        totalRevenue: totalRevenue.toFixed(2),
        totalOrders,
        completedOrders: completedCount,
        averageOrderValue: averageOrderValue.toFixed(2),
      },
      ordersByStatus: statusGroups
        .map((row) => ({
          status: row.status,
          count: row._count._all,
        }))
        .sort((a, b) => a.status.localeCompare(b.status)),
      revenueByDay: [...byDay.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, bucket]) => ({
          date,
          revenue: bucket.revenue.toFixed(2),
          orders: bucket.orders,
        })),
      revenueByMonth: [...byMonth.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, bucket]) => ({
          month,
          revenue: bucket.revenue.toFixed(2),
          orders: bucket.orders,
        })),
      topProducts,
    };
  }

  private assertDateRange(from: string, to: string): void {
    if (from.slice(0, 10) > to.slice(0, 10)) {
      throw new BadRequestException(MESSAGES.INVALID_CREATED_DATE_RANGE);
    }
  }

  private toDateOnly(value: string): Date {
    return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  }

  private toExclusiveEndDate(value: string): Date {
    const end = this.toDateOnly(value);
    end.setUTCDate(end.getUTCDate() + 1);
    return end;
  }
}
