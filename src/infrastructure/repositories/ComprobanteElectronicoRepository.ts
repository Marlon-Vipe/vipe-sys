import { Repository, Between, In } from 'typeorm';
import { AppDataSource } from '../../shared/config/database';
import { ComprobanteElectronico } from '../../domain/entities/ComprobanteElectronico';
import { IComprobanteElectronicoRepository } from '../../domain/repositories/IComprobanteElectronicoRepository';
import { EstadoComprobante } from '../../shared/enums/DGIIEnums';

export class ComprobanteElectronicoRepository implements IComprobanteElectronicoRepository {
  private repository: Repository<ComprobanteElectronico>;

  constructor() {
    this.repository = AppDataSource.getRepository(ComprobanteElectronico);
  }

  async create(comprobante: ComprobanteElectronico): Promise<ComprobanteElectronico> {
    return await this.repository.save(comprobante);
  }

  async findById(id: string): Promise<ComprobanteElectronico | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByTrackId(trackId: string): Promise<ComprobanteElectronico | null> {
    return await this.repository.findOne({ where: { trackId } });
  }

  async findByRnc(rnc: string, limit: number = 50, offset: number = 0): Promise<ComprobanteElectronico[]> {
    return await this.repository.find({
      where: { rncEmisor: rnc },
      order: { fechaRecepcion: 'DESC' },
      take: limit,
      skip: offset
    });
  }

  async findByRncAndEncf(rnc: string, encf: string): Promise<ComprobanteElectronico | null> {
    return await this.repository.findOne({ 
      where: { rncEmisor: rnc, encf } 
    });
  }

  async findByEstado(estado: EstadoComprobante, limit: number = 50, offset: number = 0): Promise<ComprobanteElectronico[]> {
    return await this.repository.find({
      where: { estado },
      order: { fechaRecepcion: 'DESC' },
      take: limit,
      skip: offset
    });
  }

  async findByFechaRange(
    fechaDesde: Date,
    fechaHasta: Date,
    rnc?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<ComprobanteElectronico[]> {
    const query = this.repository.createQueryBuilder('comprobante')
      .where('comprobante.fechaRecepcion BETWEEN :fechaDesde AND :fechaHasta', {
        fechaDesde,
        fechaHasta
      });

    if (rnc) {
      query.andWhere('comprobante.rncEmisor = :rnc', { rnc });
    }

    return await query
      .orderBy('comprobante.fechaRecepcion', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  async update(comprobante: ComprobanteElectronico): Promise<ComprobanteElectronico> {
    return await this.repository.save(comprobante);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async countByRnc(rnc: string): Promise<number> {
    return await this.repository.count({ where: { rncEmisor: rnc } });
  }

  async countByEstado(estado: EstadoComprobante): Promise<number> {
    return await this.repository.count({ where: { estado } });
  }

  async findPendingProcessing(limit: number = 100): Promise<ComprobanteElectronico[]> {
    return await this.repository.find({
      where: { estado: EstadoComprobante.EN_PROCESO },
      order: { fechaRecepcion: 'ASC' },
      take: limit
    });
  }

  async findExpiredTokens(): Promise<ComprobanteElectronico[]> {
    const fechaLimite = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 horas atrás
    
    return await this.repository.find({
      where: {
        estado: EstadoComprobante.EN_PROCESO,
        fechaRecepcion: Between(new Date(0), fechaLimite)
      },
      order: { fechaRecepcion: 'ASC' }
    });
  }
}
