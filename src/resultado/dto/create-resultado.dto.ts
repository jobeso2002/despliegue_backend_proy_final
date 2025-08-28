import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsPositive, IsString, Min, ValidateNested } from 'class-validator';

class SetResultadoDto {
  @ApiProperty({ example: 1, description: 'Número del set (1-5)' })
  @IsInt()
  @Min(1)
  numeroSet: number;

  @ApiProperty({ example: 25, description: 'Puntos del equipo local en este set' })
  @IsInt()
  @Min(0)
  puntosLocal: number;

  @ApiProperty({ example: 20, description: 'Puntos del equipo visitante en este set' })
  @IsInt()
  @Min(0)
  puntosVisitante: number;
}

export class CreateResultadoDto {
  @ApiProperty({
    example: 2,
    description: 'Sets ganados por el equipo local',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  setsLocal: number;

  @ApiProperty({
    example: 1,
    description: 'Sets ganados por el equipo visitante',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  setsVisitante: number;

  @ApiProperty({
    type: [SetResultadoDto],
    description: 'Detalle de puntos por set',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetResultadoDto)
  sets: SetResultadoDto[];
  
  @ApiProperty({
    example: 90,
    description: 'Duración del partido en minutos',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  duracion?: number;

  @ApiProperty({
    example: 'El partido se suspendió por lluvia',
    description: 'Observaciones adicionales del partido',
    required: false,
  })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsInt()
  @IsPositive()
  partidoId: number;

  @IsInt()
  @IsPositive()
  usuarioRegistraId: number;
}
