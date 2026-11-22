import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MESSAGES } from '../../common/constants/messages';
import {
  ApiStandardErrorResponse,
  ApiStandardPaginatedResponse,
  ApiStandardResponse,
} from '../../common/decorators/api-standard-response.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { OrderResponseDto } from './dto/order-response.dto';
import { QueryOrderHistoryDto } from './dto/query-order-history.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Permissions('orders.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({
    summary:
      'Danh sách đơn hàng (bắt buộc page, limit, createdFrom, createdTo)',
  })
  @ApiStandardPaginatedResponse({
    type: OrderResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findAll(@Query() query: QueryOrderDto) {
    return this.ordersService.findAll(query);
  }

  @Get('history')
  @Permissions('orders.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({
    summary:
      'Lịch sử đơn (REJECTED|COMPLETED; bắt buộc page, limit, createdFrom, createdTo)',
  })
  @ApiStandardPaginatedResponse({
    type: OrderResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findHistory(@Query() query: QueryOrderHistoryDto) {
    return this.ordersService.findHistory(query);
  }

  @Get(':id')
  @Permissions('orders.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Chi tiết đơn hàng' })
  @ApiStandardResponse({
    type: OrderResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Put(':id/update')
  @Permissions('orders.update')
  @ResponseMessage(MESSAGES.UPDATE_SUCCESS)
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng' })
  @ApiStandardResponse({
    type: OrderResponseDto,
    description: MESSAGES.UPDATE_SUCCESS,
  })
  @ApiStandardErrorResponse()
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }
}
