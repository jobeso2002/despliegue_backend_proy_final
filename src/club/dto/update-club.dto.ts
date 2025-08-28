import { PartialType } from '@nestjs/swagger';
import { CreateClubDto } from './create-club.dto';
import { IsOptional } from 'class-validator';

export class UpdateClubDto extends PartialType(CreateClubDto) {
    @IsOptional()
  logoFile?: any;
}