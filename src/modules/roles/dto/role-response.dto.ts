import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'MANAGER' })
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiProperty()
  isSystem!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class PermissionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'users.view' })
  code!: string;

  @ApiProperty()
  module!: string;

  @ApiProperty()
  action!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;
}

export class RoleDetailResponseDto extends RoleResponseDto {
  @ApiProperty({ type: [PermissionResponseDto] })
  permissions!: PermissionResponseDto[];
}

export class RolePermissionsResponseDto {
  @ApiProperty({ type: [PermissionResponseDto] })
  permissions!: PermissionResponseDto[];
}

export class DeletedRoleResponseDto {
  @ApiProperty()
  id!: string;
}
