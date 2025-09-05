import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

// tus módulos
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MulterModule.register({
      dest: './uploads', // almacenamiento temporal de archivos
    }),

    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const isProd = process.env.NODE_ENV === 'production';

        return {
          type: 'postgres',
          url: process.env.DATABASE_URL || undefined, // Render usa DATABASE_URL
          host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
          port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DB_PORT ?? "5432", 10),
          username: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
          password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
          database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
          autoLoadEntities: true, // carga entidades automáticamente
          synchronize: false, // nunca true en producción
          
        };
      },
    }),

    // tus módulos de negocio
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
