import { Partido } from '../../partido/entities/partido.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SetResultado } from './set-resulado';

@Entity()
export class Resultado {
  @PrimaryGeneratedColumn({ name: 'id_resultado' })
  id: number;

  @Column({ name: 'sets_local', type: 'int', default: 0 })
  setsLocal: number;

  @Column({ name: 'sets_visitante', type: 'int', default: 0 })
  setsVisitante: number;

  @Column({ type: 'int', nullable: true, comment: 'Duración en minutos' })
  duracion: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @OneToOne(() => Partido, (partido) => partido.resultado)
  @JoinColumn({ name: 'id_partido' })
  partido: Partido;

  @ManyToOne(() => Usuario, (usuario) => usuario.resultadosRegistrados)
  usuarioRegistra: Usuario;

  @OneToMany(() => SetResultado, (set) => set.resultado, { cascade: true })
  sets: SetResultado[];
}
