import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../../../generated/prisma/client';

export class AuthRoleDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'SUPER_ADMIN' })
  code!: string;

  @ApiProperty()
  name!: string;
}

export class MeResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty({ enum: UserStatus })
  status!: UserStatus;

  @ApiProperty({ type: AuthRoleDto })
  role!: AuthRoleDto;

  @ApiProperty({ type: [String] })
  permissions!: string[];
}

export class TokenResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty({ example: '15m' })
  expiresIn!: string;
}

export class LoginResponseDto extends TokenResponseDto {
  @ApiProperty({ type: MeResponseDto })
  user!: MeResponseDto;
}

export class LogoutResponseDto {
  @ApiProperty({ example: true })
  revoked!: boolean;
}
