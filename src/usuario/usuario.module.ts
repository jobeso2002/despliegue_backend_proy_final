import { forwardRef, Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { ClubModule } from '../club/club.module';
import { EventoModule } from '../evento/evento.module';
import { PartidoModule } from '../partido/partido.module';
import { TransferenciaModule } from '../transferencia/transferencia.module';
import { InscripcionModule } from '../inscripcion/inscripcion.module';
import { ResultadoModule } from '../resultado/resultado.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    forwardRef(() => AuthModule),
    RolesModule,
    forwardRef(() => ClubModule),
    forwardRef(() => EventoModule),
    forwardRef(() => PartidoModule),
    forwardRef(() => TransferenciaModule),
    forwardRef(() => InscripcionModule),
    forwardRef(() => ResultadoModule),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [TypeOrmModule.forFeature([Usuario]), UsuarioService],
})
export class UsuarioModule {}
