import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Resultado } from './resultado.entity';

@Entity()
export class SetResultado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  numeroSet: number; // 1, 2, 3, 4 o 5

  @Column({ type: 'int' })
  puntosLocal: number;

  @Column({ type: 'int' })
  puntosVisitante: number;

  @ManyToOne(() => Resultado, (resultado) => resultado.sets)
  resultado: Resultado;
}