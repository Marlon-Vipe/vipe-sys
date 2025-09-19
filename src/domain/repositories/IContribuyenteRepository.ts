import { Contribuyente } from '../entities/Contribuyente';

export interface IContribuyenteRepository {
  create(contribuyente: Contribuyente): Promise<Contribuyente>;
  findById(id: string): Promise<Contribuyente | null>;
  findByRnc(rnc: string): Promise<Contribuyente | null>;
  findByRazonSocial(razonSocial: string): Promise<Contribuyente[]>;
  findByEstado(estado: string): Promise<Contribuyente[]>;
  findActive(): Promise<Contribuyente[]>;
  findElectronicEmitters(): Promise<Contribuyente[]>;
  findElectronicReceivers(): Promise<Contribuyente[]>;
  update(contribuyente: Contribuyente): Promise<Contribuyente>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  countByEstado(estado: string): Promise<number>;
  findUpdatedAfter(fecha: Date): Promise<Contribuyente[]>;
  searchByText(texto: string): Promise<Contribuyente[]>;
  isRncValid(rnc: string): Promise<boolean>;
  isRncActive(rnc: string): Promise<boolean>;
  canEmitElectronically(rnc: string): Promise<boolean>;
  canReceiveElectronically(rnc: string): Promise<boolean>;
}
