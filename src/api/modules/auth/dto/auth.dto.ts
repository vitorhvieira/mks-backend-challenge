import { ApiProperty } from '@nestjs/swagger';

export class AuthPayloadDTO {
  @ApiProperty({ example: 'vitorAtualizado@emai.com' })
  email: string;

  @ApiProperty({ example: 'senhaNova123' })
  password: string;
}
