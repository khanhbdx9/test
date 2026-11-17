import {
  Controller,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { MESSAGES } from '../../common/constants/messages';
import {
  ApiStandardArrayResponse,
  ApiStandardErrorResponse,
} from '../../common/decorators/api-standard-response.decorator';
import { AnyPermissions } from '../../common/decorators/permissions.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { UploadFolderDto } from './dto/upload-folder.dto';
import { UploadImageResponseDto } from './dto/upload-image-response.dto';
import {
  MAX_TOTAL_UPLOAD_BYTES,
  MAX_UPLOAD_FILES,
} from './image-file';
import { IncomingImage, UploadsService } from './uploads.service';

@ApiTags('Uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('images')
  @AnyPermissions(
    'products.create',
    'posts.create',
    'banners.manage',
    'themes.manage',
  )
  @ResponseMessage(MESSAGES.CREATED)
  @ApiOperation({
    summary:
      'Upload nhiều ảnh, folder tùy chọn; không truyền thì lưu trong uploads/, tổng tối đa 10MB',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['files'],
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiStandardArrayResponse({
    type: UploadImageResponseDto,
    status: 201,
    description: MESSAGES.CREATED,
  })
  @ApiStandardErrorResponse()
  @UseInterceptors(
    FilesInterceptor('files', MAX_UPLOAD_FILES, {
      limits: { fileSize: MAX_TOTAL_UPLOAD_BYTES },
    }),
  )
  uploadImages(
    @UploadedFiles() files: IncomingImage[] | undefined,
    @Query() query: UploadFolderDto,
    @Req() request: Request,
  ) {
    const protocol = request.get('x-forwarded-proto') ?? request.protocol;
    return this.uploadsService.saveImages(
      files,
      `${protocol}://${request.get('host')}`,
      query.folder ?? undefined,
    );
  }
}
