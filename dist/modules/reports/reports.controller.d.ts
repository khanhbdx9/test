import { QueryReportDto } from './dto/query-report.dto';
import { ReportDashboardDto } from './dto/report-response.dto';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDashboard(query: QueryReportDto): Promise<ReportDashboardDto>;
    getRevenue(query: QueryReportDto): Promise<ReportDashboardDto>;
}
