import { TipoECF } from '../../shared/enums/DGIIEnums';

export interface ISecuenciaNCFService {
  obtenerSecuenciaDisponible(rnc: string, tipoECF: TipoECF): Promise<string | null>;
  validarSecuencia(rnc: string, secuencia: string, tipoECF: TipoECF): Promise<boolean>;
  usarSecuencia(rnc: string, secuencia: string, tipoECF: TipoECF): Promise<boolean>;
  liberarSecuencia(rnc: string, secuencia: string, tipoECF: TipoECF): Promise<void>;
  obtenerSecuenciasPorRnc(rnc: string): Promise<any[]>;
  verificarVencimientos(): Promise<void>;
  generarReporteUtilizacion(rnc: string): Promise<any>;
}
