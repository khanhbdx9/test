import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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
import { CreateProductDto } from './dto/create-product.dto';
import {
  DeletedProductResponseDto,
  ProductResponseDto,
} from './dto/product-response.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Permissions('products.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Danh sách sản phẩm' })
  @ApiStandardPaginatedResponse({
    type: ProductResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @Permissions('products.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Chi tiết sản phẩm' })
  @ApiStandardResponse({
    type: ProductResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Permissions('products.create')
  @ResponseMessage(MESSAGES.CREATED)
  @ApiOperation({ summary: 'Tạo sản phẩm' })
  @ApiStandardResponse({
    type: ProductResponseDto,
    status: 201,
    description: MESSAGES.CREATED,
  })
  @ApiStandardErrorResponse()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @Permissions('products.update')
  @ResponseMessage(MESSAGES.UPDATE_SUCCESS)
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  @ApiStandardResponse({
    type: ProductResponseDto,
    description: MESSAGES.UPDATE_SUCCESS,
  })
  @ApiStandardErrorResponse()
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('products.delete')
  @ResponseMessage(MESSAGES.DELETE_SUCCESS)
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  @ApiStandardResponse({
    type: DeletedProductResponseDto,
    description: MESSAGES.DELETE_SUCCESS,
  })
  @ApiStandardErrorResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
