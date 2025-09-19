import { Repository, Between, LessThan } from 'typeorm';
import { AppDataSource } from '../../shared/config/database';
import { LogTransaccion } from '../../domain/entities/LogTransaccion';
import { ILogTransaccionRepository } from '../../domain/repositories/ILogTransaccionRepository';
import { TipoOperacion } from '../../shared/enums/DGIIEnums';

export class LogTransaccionRepository implements ILogTransaccionRepository {
  private repository: Repository<LogTransaccion>;

  constructor() {
    this.repository = AppDataSource.getRepository(LogTransaccion);
  }

  async create(log: LogTransaccion): Promise<LogTransaccion> {
    return await this.repository.save(log);
  }

  async findById(id: string): Promise<LogTransaccion | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByRnc(rnc: string, limit: number = 50, offset: number = 0): Promise<LogTransaccion[]> {
    return await this.repository.find({
      where: { rnc },
      order: { fechaTransaccion: 'DESC' },
      take: limit,
      skip: offset
    });
  }

  async findByTrackId(trackId: string): Promise<LogTransaccion[]> {
    return await this.repository.find({
      where: { trackId },
      order: { fechaTransaccion: 'ASC' }
    });
  }

  async findByTipoOperacion(tipoOperacion: TipoOperacion, limit: number = 50, offset: number = 0): Promise<LogTransaccion[]> {
    return await this.repository.find({
      where: { tipoOperacion },
      order: { fechaTransaccion: 'DESC' },
      take: limit,
      skip: offset
    });
  }

  async findByNivel(nivel: string, limit: number = 50, offset: number = 0): Promise<LogTransaccion[]> {
    return await this.repository.find({
      where: { nivel },
      order: { fechaTransaccion: 'DESC' },
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
  ): Promise<LogTransaccion[]> {
    const query = this.repository.createQueryBuilder('log')
      .where('log.fechaTransaccion BETWEEN :fechaDesde AND :fechaHasta', {
        fechaDesde,
        fechaHasta
      });

    if (rnc) {
      query.andWhere('log.rnc = :rnc', { rnc });
    }

    return await query
      .orderBy('log.fechaTransaccion', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  async findByExito(exito: boolean, limit: number = 50, offset: number = 0): Promise<LogTransaccion[]> {
    return await this.repository.find({
      where: { exito },
      order: { fechaTransaccion: 'DESC' },
      take: limit,
      skip: offset
    });
  }

  async countByRnc(rnc: string): Promise<number> {
    return await this.repository.count({ where: { rnc } });
  }

  async countByTipoOperacion(tipoOperacion: TipoOperacion): Promise<number> {
    return await this.repository.count({ where: { tipoOperacion } });
  }

  async countByNivel(nivel: string): Promise<number> {
    return await this.repository.count({ where: { nivel } });
  }

  async countByExito(exito: boolean): Promise<number> {
    return await this.repository.count({ where: { exito } });
  }

  async findErrors(limit: number = 50, offset: number = 0): Promise<LogTransaccion[]> {
    return await this.repository.find({
      where: { nivel: 'error' },
      order: { fechaTransaccion: 'DESC' },
      take: limit,
      skip: offset
    });
  }

  async findSlowQueries(tiempoMinimo: number, limit: number = 50): Promise<LogTransaccion[]> {
    return await this.repository.find({
      where: { 
        tiempoRespuesta: LessThan(tiempoMinimo),
        exito: true
      },
      order: { tiempoRespuesta: 'ASC' },
      take: limit
    });
  }

  async deleteOldLogs(daysToKeep: number): Promise<number> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - daysToKeep);

    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .where('fechaTransaccion < :fechaLimite', { fechaLimite })
      .execute();

    return result.affected || 0;
  }

  async getMetricsByDateRange(fechaDesde: Date, fechaHasta: Date): Promise<{
    totalRequests: number;
    requestsExitosos: number;
    requestsFallidos: number;
    tiempoPromedioRespuesta: number;
    erroresPorTipo: Record<string, number>;
  }> {
    const logs = await this.repository.find({
      where: {
        fechaTransaccion: Between(fechaDesde, fechaHasta)
      }
    });

    const totalRequests = logs.length;
    const requestsExitosos = logs.filter(log => log.exito).length;
    const requestsFallidos = totalRequests - requestsExitosos;
    
    const logsConTiempo = logs.filter(log => log.tiempoRespuesta !== null);
    const tiempoPromedioRespuesta = logsConTiempo.length > 0 
      ? logsConTiempo.reduce((sum, log) => sum + (log.tiempoRespuesta || 0), 0) / logsConTiempo.length
      : 0;

    const erroresPorTipo: Record<string, number> = {};
    logs.filter(log => !log.exito).forEach(log => {
      const tipo = log.tipoOperacion || 'unknown';
      erroresPorTipo[tipo] = (erroresPorTipo[tipo] || 0) + 1;
    });

    return {
      totalRequests,
      requestsExitosos,
      requestsFallidos,
      tiempoPromedioRespuesta,
      erroresPorTipo
    };
  }
}
