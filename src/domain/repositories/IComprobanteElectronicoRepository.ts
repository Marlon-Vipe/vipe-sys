import { ComprobanteElectronico } from '../entities/ComprobanteElectronico';
import { EstadoComprobante } from '../../shared/enums/DGIIEnums';

export interface IComprobanteElectronicoRepository {
  create(comprobante: ComprobanteElectronico): Promise<ComprobanteElectronico>;
  findById(id: string): Promise<ComprobanteElectronico | null>;
  findByTrackId(trackId: string): Promise<ComprobanteElectronico | null>;
  findByRnc(rnc: string, limit?: number, offset?: number): Promise<ComprobanteElectronico[]>;
  findByRncAndEncf(rnc: string, encf: string): Promise<ComprobanteElectronico | null>;
  findByEstado(estado: EstadoComprobante, limit?: number, offset?: number): Promise<ComprobanteElectronico[]>;
  findByFechaRange(
    fechaDesde: Date,
    fechaHasta: Date,
    rnc?: string,
    limit?: number,
    offset?: number
  ): Promise<ComprobanteElectronico[]>;
  update(comprobante: ComprobanteElectronico): Promise<ComprobanteElectronico>;
  delete(id: string): Promise<void>;
  countByRnc(rnc: string): Promise<number>;
  countByEstado(estado: EstadoComprobante): Promise<number>;
  findPendingProcessing(limit?: number): Promise<ComprobanteElectronico[]>;
  findExpiredTokens(): Promise<ComprobanteElectronico[]>;
}
