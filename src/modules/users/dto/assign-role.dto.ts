import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty()
  @IsUUID('4', { message: 'Role không hợp lệ' })
  roleId!: string;
}
