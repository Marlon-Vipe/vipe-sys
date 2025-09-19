import { LogTransaccion } from '../entities/LogTransaccion';
import { TipoOperacion } from '../../shared/enums/DGIIEnums';

export interface ILogTransaccionRepository {
  create(log: LogTransaccion): Promise<LogTransaccion>;
  findById(id: string): Promise<LogTransaccion | null>;
  findByRnc(rnc: string, limit?: number, offset?: number): Promise<LogTransaccion[]>;
  findByTrackId(trackId: string): Promise<LogTransaccion[]>;
  findByTipoOperacion(tipoOperacion: TipoOperacion, limit?: number, offset?: number): Promise<LogTransaccion[]>;
  findByNivel(nivel: string, limit?: number, offset?: number): Promise<LogTransaccion[]>;
  findByFechaRange(
    fechaDesde: Date,
    fechaHasta: Date,
    rnc?: string,
    limit?: number,
    offset?: number
  ): Promise<LogTransaccion[]>;
  findByExito(exito: boolean, limit?: number, offset?: number): Promise<LogTransaccion[]>;
  countByRnc(rnc: string): Promise<number>;
  countByTipoOperacion(tipoOperacion: TipoOperacion): Promise<number>;
  countByNivel(nivel: string): Promise<number>;
  countByExito(exito: boolean): Promise<number>;
  findErrors(limit?: number, offset?: number): Promise<LogTransaccion[]>;
  findSlowQueries(tiempoMinimo: number, limit?: number): Promise<LogTransaccion[]>;
  deleteOldLogs(daysToKeep: number): Promise<number>;
  getMetricsByDateRange(fechaDesde: Date, fechaHasta: Date): Promise<{
    totalRequests: number;
    requestsExitosos: number;
    requestsFallidos: number;
    tiempoPromedioRespuesta: number;
    erroresPorTipo: Record<string, number>;
  }>;
}
