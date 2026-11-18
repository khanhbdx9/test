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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { AuthenticatedUser } from '../auth/authenticated-user';
import { CreatePostDto } from './dto/create-post.dto';
import {
  DeletedPostResponseDto,
  PostResponseDto,
} from './dto/post-response.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Permissions('posts.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Danh sách bài viết' })
  @ApiStandardPaginatedResponse({
    type: PostResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findAll(@Query() query: QueryPostDto) {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  @Permissions('posts.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Chi tiết bài viết' })
  @ApiStandardResponse({
    type: PostResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.findOne(id);
  }

  @Post()
  @Permissions('posts.create')
  @ResponseMessage(MESSAGES.CREATED)
  @ApiOperation({ summary: 'Tạo bài viết (content HTML CKEditor)' })
  @ApiStandardResponse({
    type: PostResponseDto,
    status: 201,
    description: MESSAGES.CREATED,
  })
  @ApiStandardErrorResponse()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePostDto,
  ) {
    return this.postsService.create(user.id, dto);
  }

  @Patch(':id')
  @Permissions('posts.update')
  @ResponseMessage(MESSAGES.UPDATE_SUCCESS)
  @ApiOperation({ summary: 'Cập nhật bài viết' })
  @ApiStandardResponse({
    type: PostResponseDto,
    description: MESSAGES.UPDATE_SUCCESS,
  })
  @ApiStandardErrorResponse()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(id, dto);
  }

  @Patch(':id/publish')
  @Permissions('posts.publish')
  @ResponseMessage(MESSAGES.UPDATE_SUCCESS)
  @ApiOperation({ summary: 'Xuất bản bài viết' })
  @ApiStandardResponse({
    type: PostResponseDto,
    description: MESSAGES.UPDATE_SUCCESS,
  })
  @ApiStandardErrorResponse()
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.publish(id);
  }

  @Delete(':id')
  @Permissions('posts.delete')
  @ResponseMessage(MESSAGES.DELETE_SUCCESS)
  @ApiOperation({ summary: 'Xóa mềm bài viết' })
  @ApiStandardResponse({
    type: DeletedPostResponseDto,
    description: MESSAGES.DELETE_SUCCESS,
  })
  @ApiStandardErrorResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.remove(id);
  }
}
