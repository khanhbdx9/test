import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../../../generated/prisma/client';

export class UserRoleDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;
}

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty({ enum: UserStatus })
  status!: UserStatus;

  @ApiProperty({ type: UserRoleDto })
  role!: UserRoleDto;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class DeletedUserResponseDto {
  @ApiProperty()
  id!: string;
}
