import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  q: string;
}
