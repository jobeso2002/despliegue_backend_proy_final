import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Club } from './club/entities/club.entity';
import { Contacto } from './contacto/entities/contacto.entity';
import { Deportista } from './deportista/entities/deportista.entity';
import { EstadisticaPartido } from './estadistica-partido/entities/estadistica-partido.entity';
import { Evento } from './evento/entities/evento.entity';
import { Inscripcion } from './inscripcion/entities/inscripcion.entity';
import { ClubDeportista } from './club/entities/club-deportista';
import { SetResultado } from './resultado/entities/set-resulado';
import { Usuario } from './usuario/entities/usuario.entity';
import { Transferencia } from './transferencia/entities/transferencia.entity';
import { Role } from './roles/entities/role.entity';
import { Resultado } from './resultado/entities/resultado.entity';

import { Partido } from './partido/entities/partido.entity';
import { Permiso } from './permiso/entities/permiso.entity';

const isProd = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  ssl: isProd ? { rejectUnauthorized: false } : false,  
  entities: [Club, Contacto, Deportista, EstadisticaPartido, Evento, Inscripcion, 
    Partido, Permiso, Resultado, Role, Transferencia, Usuario, ClubDeportista, SetResultado],
  migrations: ['dist/migrations/*.{js,ts}'],
  synchronize: false, // nunca true en prod
});

