/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty({
    description: 'The title of the note',
    example: 'Updated Meeting Notes',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiProperty({
    description: 'The content of the note',
    example: 'Updated project timeline and deliverables.',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;
}
