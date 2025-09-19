import { SecuenciaNCF } from '../entities/SecuenciaNCF';
import { TipoECF } from '../../shared/enums/DGIIEnums';

export interface ISecuenciaNCFRepository {
  create(secuencia: SecuenciaNCF): Promise<SecuenciaNCF>;
  findById(id: string): Promise<SecuenciaNCF | null>;
  findByRnc(rnc: string): Promise<SecuenciaNCF[]>;
  findByRncAndTipo(rnc: string, tipoECF: TipoECF): Promise<SecuenciaNCF[]>;
  findActiveByRnc(rnc: string): Promise<SecuenciaNCF[]>;
  findActiveByRncAndTipo(rnc: string, tipoECF: TipoECF): Promise<SecuenciaNCF | null>;
  findBySecuencia(rnc: string, secuencia: string): Promise<SecuenciaNCF | null>;
  update(secuencia: SecuenciaNCF): Promise<SecuenciaNCF>;
  delete(id: string): Promise<void>;
  countByRnc(rnc: string): Promise<number>;
  findExpired(): Promise<SecuenciaNCF[]>;
  findNearExpiration(days: number): Promise<SecuenciaNCF[]>;
  findLowUtilization(percentage: number): Promise<SecuenciaNCF[]>;
  canUseSecuencia(rnc: string, secuencia: string, tipoECF: TipoECF): Promise<boolean>;
  useSecuencia(rnc: string, secuencia: string, tipoECF: TipoECF): Promise<boolean>;
}
