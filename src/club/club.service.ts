import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from './entities/club.entity';
import { IsNull, Repository } from 'typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { ClubResponseDto } from './dto/club-respon.dto';
import { Deportista } from '../deportista/entities/deportista.entity';
import { AsignarDeportistaDto } from './dto/asignardeportista.dto';
import { ClubDeportista } from './entities/club-deportista';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Deportista)
    private readonly deportistaRepository: Repository<Deportista>,
    @InjectRepository(ClubDeportista)
    private readonly clubDeportistaRepository: Repository<ClubDeportista>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createClubDto: CreateClubDto,
    logoFile?: Express.Multer.File,
  ): Promise<Club> {
    // Subir imagen a Cloudinary si existe
    let logoUrl = ''; // Inicializa como string vacío
    // Subir imagen a Cloudinary si existe
  if (logoFile) {
    try {
      logoUrl = await this.cloudinaryService.uploadImage(logoFile, 'clubs');
    } catch (error) {
      throw new InternalServerErrorException('Error al subir la imagen a Cloudinary');
    }
  }

    // Verificar si ya existe un club con el mismo nombre
    const existingClub = await this.clubRepository.findOne({
      where: { nombre: createClubDto.nombre },
    });

    if (existingClub) {
      throw new ConflictException('Ya existe un club con este nombre');
    }

    // Verificar si el usuario responsable existe
    const responsable = await this.usuarioRepository.findOne({
      where: { id: createClubDto.id_usuario_responsable },
    });

    if (!responsable) {
      throw new NotFoundException(
        `Usuario responsable con ID ${createClubDto.id_usuario_responsable} no encontrado`,
      );
    }

    const club = this.clubRepository.create({
      ...createClubDto,
      responsable,
      logo: logoUrl,
    });

    return this.clubRepository.save(club);
  }

  // En tu ClubService (club.service.ts)
  async findAllByResponsable(
    responsableId: number,
  ): Promise<ClubResponseDto[]> {
    const clubs = await this.clubRepository.find({
      relations: ['responsable', 'equipos'],
      where: {
        estado: 'activo',
        deletedAt:IsNull(),
        responsable: { id: responsableId },
      },
    });

    return clubs.map((club) => this.mapClubToResponseDto(club));
  }

  async findOne(id: number): Promise<ClubResponseDto> {
    const club = await this.clubRepository.findOne({
      where: { id,  estado: 'activo',
        deletedAt: IsNull() },
      relations: ['responsable'],
    });

    if (!club) {
      throw new NotFoundException(`Club con ID ${id} no encontrado o está inactivo`);
    }

    return this.mapClubToResponseDto(club);
  }

  private mapClubToResponseDto(club: Club): ClubResponseDto {
    return {
      id: club.id,
      nombre: club.nombre,
      fundacion: club.fundacion,
      rama: club.rama,
      categoria: club.categoria,
      direccion: club.direccion,
      telefono: club.telefono,
      email: club.email,
      logo: club.logo,

      estado: club.estado,
      responsable: {
        id: club.responsable.id,
        username: club.responsable.username,
        email: club.responsable.email,
      },
    };
  }

  private async findEntity(id: number): Promise<Club> {
    const club = await this.clubRepository.findOne({
      where: { id, estado: 'activo',
        deletedAt: IsNull() },
      relations: ['responsable'],
    });

    if (!club) {
      throw new NotFoundException(`Club con ID ${id} no encontrado`);
    }
    return club;
  }

  async update(
    id: number,
    updateClubDto: UpdateClubDto,
    logoFile?:Express.Multer.File
  ): Promise<ClubResponseDto> {
    const club = await this.findEntity(id);

    if (updateClubDto.nombre && updateClubDto.nombre !== club.nombre) {
      const existingClub = await this.clubRepository.findOne({
        where: { nombre: updateClubDto.nombre },
      });

      if (existingClub && existingClub.id !== id) {
        throw new ConflictException('Ya existe un club con este nombre');
      }
    }

    // Subir nueva imagen si se proporciona
  if (logoFile) {
    try {
      const newLogoUrl = await this.cloudinaryService.uploadImage(logoFile, 'clubs');
      
      // Eliminar la imagen anterior si existe
      if (club.logo) {
        await this.cloudinaryService.deleteImage(club.logo).catch(() => {});
      }
      
      club.logo = newLogoUrl;
    } catch (error) {
      throw new InternalServerErrorException('Error al subir la nueva imagen del logo');
    }
  }

    if (updateClubDto.id_usuario_responsable) {
      const responsable = await this.usuarioRepository.findOne({
        where: { id: updateClubDto.id_usuario_responsable },
      });

      if (!responsable) {
        throw new NotFoundException(
          `Usuario responsable con ID ${updateClubDto.id_usuario_responsable} no encontrado`,
        );
      }
      club.responsable = responsable;
    }

    // Actualizar otros campos
  if (updateClubDto.nombre) club.nombre = updateClubDto.nombre;
  if (updateClubDto.fundacion) club.fundacion = updateClubDto.fundacion;
  if (updateClubDto.rama) club.rama = updateClubDto.rama;
  if (updateClubDto.categoria) club.categoria = updateClubDto.categoria;
  if (updateClubDto.direccion) club.direccion = updateClubDto.direccion;
  if (updateClubDto.telefono) club.telefono = updateClubDto.telefono;
  if (updateClubDto.email) club.email = updateClubDto.email;

  const updatedClub = await this.clubRepository.save(club);
    return this.mapClubToResponseDto(updatedClub);
  }

  async remove(id: number): Promise<{ message: string }> {
    const club = await this.clubRepository.findOne({
      where: { id },
      relations: [
        'inscripciones',
        'transferenciasSalientes', 
        'transferenciasEntrantes',
        'partidosLocal',
        'partidosVisitante',
        'clubDeportistas',
        'clubDeportistas.deportista'
      ]
    });
  
    if (!club) {
      throw new NotFoundException(`Club con ID ${id} no encontrado`);
    }
  
    const tieneRelaciones = 
      club.inscripciones.length > 0 ||
      club.transferenciasSalientes.length > 0 ||
      club.transferenciasEntrantes.length > 0 ||
      club.partidosLocal.length > 0 ||
      club.partidosVisitante.length > 0;
  
    if (tieneRelaciones) {
      // 1. Marcar club como inactivo
      club.estado = 'inactivo';
      club.deletedAt = new Date();
      
      // 2. Liberar a TODOS los deportistas del club
      if (club.clubDeportistas.length > 0) {
        for (const relacion of club.clubDeportistas) {
          if (relacion.estado === 'activo') {
            relacion.estado = 'inactivo';
            relacion.deletedAt = new Date();
            await this.clubDeportistaRepository.save(relacion);
          }
        }
      }
      
      await this.clubRepository.save(club);
      return { message: 'Club marcado como inactivo y deportistas liberados' };
      
    } else {
      // Eliminación física
      if (club.logo) {
        await this.cloudinaryService.deleteImage(club.logo).catch(() => {});
      }
      await this.clubRepository.remove(club);
      return { message: 'Club eliminado permanentemente' };
    }
  }

  // Modificar todos los métodos de consulta para excluir inactivos
  async findAll(): Promise<ClubResponseDto[]> {
    const clubs = await this.clubRepository.find({
      relations: ['responsable'],
      where: { 
        estado: 'activo',
        deletedAt: IsNull() // Solo clubs activos y no eliminados
      },
    });

    return clubs.map((club) => this.mapClubToResponseDto(club));
  }


  // Método para administradores que quieran ver TODOS los clubs (incluyendo inactivos)
  async findAllWithInactive(): Promise<ClubResponseDto[]> {
    const clubs = await this.clubRepository.find({
      relations: ['responsable'],
      withDeleted: true // Incluye los eliminados lógicamente
    });

    return clubs.map((club) => this.mapClubToResponseDto(club));
  }

  // Método para reactivar un club
  async reactivar(id: number): Promise<ClubResponseDto> {
    const club = await this.clubRepository.findOne({
      where: { id },
      withDeleted: true
    });

    if (!club) {
      throw new NotFoundException(`Club con ID ${id} no encontrado`);
    }

    club.estado = 'activo';
    club.deletedAt = null;
    const clubReactivado = await this.clubRepository.save(club);

    return this.mapClubToResponseDto(clubReactivado);
  }

  async asignarDeportista(
    idClub: number,
    asignarDeportistaDto: AsignarDeportistaDto,
  ): Promise<ClubDeportista> {
    // Verificar que el club existe y está activo
    const club = await this.clubRepository.findOne({ 
      where: { 
        id: idClub,
        estado: 'activo',
        deletedAt: IsNull()
      } 
    });
    if (!club) {
      throw new NotFoundException(`Club activo con ID ${idClub} no encontrado`);
    }
  
    // Verificar que el deportista existe
    const deportista = await this.deportistaRepository.findOne({
      where: { id: asignarDeportistaDto.id_deportista },
    });
    if (!deportista) {
      throw new NotFoundException(
        `Deportista con ID ${asignarDeportistaDto.id_deportista} no encontrado`,
      );
    }
  
    // Buscar asignaciones activas del deportista (excluyendo eliminadas lógicamente)
    const asignacionesActivas = await this.clubDeportistaRepository.find({
      where: {
        deportista: { id: asignarDeportistaDto.id_deportista },
        estado: 'activo',
        deletedAt: IsNull() // Solo relaciones no eliminadas
      },
      relations: ['club']
    });
  
    // Verificar si ya está en ESTE club activo
    const yaEnEsteClub = asignacionesActivas.find(
      asig => asig.club.id === idClub && asig.club.estado === 'activo'
    );
  
    if (yaEnEsteClub) {
      throw new ConflictException('El deportista ya está asignado a este club');
    }
  
    // Si está en otro club ACTIVO, no permitir reassignación
    const enOtroClubActivo = asignacionesActivas.find(
      asig => asig.club.id !== idClub && asig.club.estado === 'activo'
    );
  
    if (enOtroClubActivo) {
      throw new ConflictException(
        'El deportista ya está activo en otro club. Debe realizar una transferencia primero.'
      );
    }
  
    // Si está en club INACTIVO, inactivar la relación anterior y crear nueva
    for (const asignacion of asignacionesActivas) {
      if (asignacion.club.estado === 'inactivo') {
        asignacion.estado = 'inactivo';
        asignacion.deletedAt = new Date();
        await this.clubDeportistaRepository.save(asignacion);
      }
    }
  
    // Crear la nueva relación
    const clubDeportista = this.clubDeportistaRepository.create({
      club,
      deportista,
      fechaIngreso: asignarDeportistaDto.fecha_ingreso,
      estado: 'activo',
    });
  
    return this.clubDeportistaRepository.save(clubDeportista);
  }

  async getTransferenciasByClub(id: number): Promise<Club> {
    const club = await this.clubRepository.findOne({
      where: { id, estado: 'activo',
        deletedAt: IsNull() },
      relations: ['transferenciasSalientes', 'transferenciasEntrantes'],
    });
    if (!club) {
      throw new NotFoundException(`Club con ID ${id} no encontrado`);
    }
    return club;
  }

  // En tu ClubService (club.service.ts)
  async getDeportistasByClub(id: number): Promise<any> {
    const club = await this.clubRepository.findOne({
      where: { id, estado: 'activo',
        deletedAt: IsNull() },
      relations: ['clubDeportistas', 'clubDeportistas.deportista'],
    });

    if (!club) {
      throw new NotFoundException(`Club con ID ${id} no encontrado`);
    }

    // Filtrar solo relaciones activas
    const relacionesActivas = club.clubDeportistas.filter(
      (rel) => rel.estado === 'activo',
    );

    const deportistas = relacionesActivas.map((rel) => rel.deportista);

    return {
      club: {
        id: club.id,
        nombre: club.nombre,
      },
      deportistas: deportistas,
    };
  }
}
