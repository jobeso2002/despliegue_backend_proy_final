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
import { DataSource } from 'typeorm';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
        envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
    }),
    MulterModule.register({
      dest: './uploads', // Directorio temporal para almacenar archivos
    }),
    TypeOrmModule.forRootAsync({
      useFactory:()=>({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'production', // No sincronizar en producción
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }),
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('DataSource options are required');
        }
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
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
  ]
  
})
export class AppModule {}
