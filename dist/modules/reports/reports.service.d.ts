import { PrismaService } from '../../database/prisma/prisma.service';
import { QueryReportDto } from './dto/query-report.dto';
import { ReportDashboardDto } from './dto/report-response.dto';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboard(query: QueryReportDto): Promise<ReportDashboardDto>;
    private assertDateRange;
    private toDateOnly;
    private toExclusiveEndDate;
}
