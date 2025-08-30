import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { PermisoModule } from './permiso/permiso.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ClubModule } from './club/club.module';
import { DeportistaModule } from './deportista/deportista.module';
import { ContactoModule } from './contacto/contacto.module';
import { TransferenciaModule } from './transferencia/transferencia.module';
import { EventoModule } from './evento/evento.module';
import { InscripcionModule } from './inscripcion/inscripcion.module';
import { PartidoModule } from './partido/partido.module';
import { ResultadoModule } from './resultado/resultado.module';
import { EstadisticaPartidoModule } from './estadistica-partido/estadistica-partido.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { Club } from './club/entities/club.entity';
import { Contacto } from './contacto/entities/contacto.entity';
import { Deportista } from './deportista/entities/deportista.entity';
import { EstadisticaPartido } from './estadistica-partido/entities/estadistica-partido.entity';
import { Evento } from './evento/entities/evento.entity';
import { Inscripcion } from './inscripcion/entities/inscripcion.entity';
import { Partido } from './partido/entities/partido.entity';
import { Permiso } from './permiso/entities/permiso.entity';
import { Resultado } from './resultado/entities/resultado.entity';
import { Role } from './roles/entities/role.entity';
import { Transferencia } from './transferencia/entities/transferencia.entity';
import { Usuario } from './usuario/entities/usuario.entity';
import { ClubDeportista } from './club/entities/club-deportista';
import { SetResultado } from './resultado/entities/set-resulado';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MulterModule.register({
      dest: './uploads', // Directorio temporal para almacenar archivos
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [Club, Contacto, Deportista, EstadisticaPartido, Evento, Inscripcion, 
        Partido, Permiso, Resultado, Role, Transferencia, Usuario, ClubDeportista, SetResultado],
        autoLoadEntities: true,
        synchronize: false, // Nunca true en producción
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false, // Siempre SSL en producción
      }),
    }),
    RolesModule,
    AuthModule,
    PermisoModule,
    UsuarioModule,
    ClubModule,
    DeportistaModule,
    ContactoModule,
    TransferenciaModule,
    EventoModule,
    InscripcionModule,
    PartidoModule,
    ResultadoModule,
    EstadisticaPartidoModule,
    CloudinaryModule,
  ],
})
export class AppModule {}
