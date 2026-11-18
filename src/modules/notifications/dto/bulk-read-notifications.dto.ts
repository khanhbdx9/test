import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class BulkReadNotificationsDto {
  @ApiPropertyOptional({
    type: [String],
    description: 'Danh sách id thông báo cần đánh dấu đã đọc',
  })
  @ValidateIf((o: BulkReadNotificationsDto) => !o.all)
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  ids?: string[];

  @ApiPropertyOptional({
    description: 'Đánh dấu tất cả thông báo của user hiện tại là đã đọc',
  })
  @Transform(({ value }: { value: unknown }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsOptional()
  @IsBoolean()
  all?: boolean;
}
