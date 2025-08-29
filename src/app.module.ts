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
       envFilePath: '.env'
    }),
    MulterModule.register({
      dest: './uploads', // Directorio temporal para almacenar archivos
    }),
    TypeOrmModule.forRootAsync({
      useFactory:()=>({
        type: 'postgres',
        url: process.env.DATABASE_URL, // Render proporciona esta variable
        autoLoadEntities: true,
        synchronize: false, // Nunca true en producción
        ssl: { rejectUnauthorized: false }, // Siempre SSL en producción
        extra: {
          ssl: process.env.NODE_ENV === 'production' ? {
            rejectUnauthorized: false
          } : false,
        }
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
  ]
  
})
export class AppModule {}
