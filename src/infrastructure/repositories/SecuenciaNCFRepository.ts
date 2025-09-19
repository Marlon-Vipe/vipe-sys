import { Repository, Between } from 'typeorm';
import { AppDataSource } from '../../shared/config/database';
import { SecuenciaNCF } from '../../domain/entities/SecuenciaNCF';
import { ISecuenciaNCFRepository } from '../../domain/repositories/ISecuenciaNCFRepository';
import { TipoECF } from '../../shared/enums/DGIIEnums';

export class SecuenciaNCFRepository implements ISecuenciaNCFRepository {
  private repository: Repository<SecuenciaNCF>;

  constructor() {
    this.repository = AppDataSource.getRepository(SecuenciaNCF);
  }

  async create(secuencia: SecuenciaNCF): Promise<SecuenciaNCF> {
    return await this.repository.save(secuencia);
  }

  async findById(id: string): Promise<SecuenciaNCF | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByRnc(rnc: string): Promise<SecuenciaNCF[]> {
    return await this.repository.find({ 
      where: { rncEmisor: rnc },
      order: { fechaCreacion: 'DESC' }
    });
  }

  async findByRncAndTipo(rnc: string, tipoECF: TipoECF): Promise<SecuenciaNCF[]> {
    return await this.repository.find({ 
      where: { rncEmisor: rnc, tipoECF },
      order: { fechaCreacion: 'DESC' }
    });
  }

  async findActiveByRnc(rnc: string): Promise<SecuenciaNCF[]> {
    return await this.repository.find({ 
      where: { rncEmisor: rnc, activa: true },
      order: { fechaCreacion: 'DESC' }
    });
  }

  async findActiveByRncAndTipo(rnc: string, tipoECF: TipoECF): Promise<SecuenciaNCF | null> {
    return await this.repository.findOne({ 
      where: { rncEmisor: rnc, tipoECF, activa: true },
      order: { fechaCreacion: 'DESC' }
    });
  }

  async findBySecuencia(rnc: string, secuencia: string): Promise<SecuenciaNCF | null> {
    return await this.repository
      .createQueryBuilder('secuencia')
      .where('secuencia.rncEmisor = :rnc', { rnc })
      .andWhere(':secuencia BETWEEN secuencia.secuenciaDesde AND secuencia.secuenciaHasta', { secuencia })
      .getOne();
  }

  async update(secuencia: SecuenciaNCF): Promise<SecuenciaNCF> {
    return await this.repository.save(secuencia);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async countByRnc(rnc: string): Promise<number> {
    return await this.repository.count({ where: { rncEmisor: rnc } });
  }

  async findExpired(): Promise<SecuenciaNCF[]> {
    return await this.repository
      .createQueryBuilder('secuencia')
      .where('secuencia.fechaVencimiento < :now', { now: new Date() })
      .andWhere('secuencia.activa = :activa', { activa: true })
      .getMany();
  }

  async findNearExpiration(days: number): Promise<SecuenciaNCF[]> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + days);

    return await this.repository
      .createQueryBuilder('secuencia')
      .where('secuencia.fechaVencimiento BETWEEN :now AND :fechaLimite', {
        now: new Date(),
        fechaLimite
      })
      .andWhere('secuencia.activa = :activa', { activa: true })
      .getMany();
  }

  async findLowUtilization(percentage: number): Promise<SecuenciaNCF[]> {
    return await this.repository
      .createQueryBuilder('secuencia')
      .where('(secuencia.cantidadUtilizada / secuencia.cantidadAutorizada * 100) < :percentage', { percentage })
      .andWhere('secuencia.activa = :activa', { activa: true })
      .getMany();
  }

  async canUseSecuencia(rnc: string, secuencia: string, tipoECF: TipoECF): Promise<boolean> {
    const secuenciaNCF = await this.findActiveByRncAndTipo(rnc, tipoECF);
    
    if (!secuenciaNCF) {
      return false;
    }

    return secuenciaNCF.canUse(secuencia);
  }

  async useSecuencia(rnc: string, secuencia: string, tipoECF: TipoECF): Promise<boolean> {
    const secuenciaNCF = await this.findActiveByRncAndTipo(rnc, tipoECF);
    
    if (!secuenciaNCF) {
      return false;
    }

    const success = secuenciaNCF.useSecuencia(secuencia);
    
    if (success) {
      await this.repository.save(secuenciaNCF);
    }

    return success;
  }
}
