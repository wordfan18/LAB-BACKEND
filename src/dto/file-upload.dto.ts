import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}