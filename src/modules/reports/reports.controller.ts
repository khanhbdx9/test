import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MESSAGES } from '../../common/constants/messages';
import {
  ApiStandardErrorResponse,
  ApiStandardResponse,
} from '../../common/decorators/api-standard-response.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { QueryReportDto } from './dto/query-report.dto';
import { ReportDashboardDto } from './dto/report-response.dto';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @Permissions('reports.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({
    summary:
      'Tổng hợp dữ liệu biểu đồ/báo cáo (doanh thu COMPLETED, trạng thái, top SP)',
  })
  @ApiStandardResponse({
    type: ReportDashboardDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  getDashboard(@Query() query: QueryReportDto) {
    return this.reportsService.getDashboard(query);
  }

  @Get('revenue')
  @Permissions('reports.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({
    summary: 'Alias dashboard — dữ liệu doanh thu và vận hành cửa hàng',
  })
  @ApiStandardResponse({
    type: ReportDashboardDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  getRevenue(@Query() query: QueryReportDto) {
    return this.reportsService.getDashboard(query);
  }
}
