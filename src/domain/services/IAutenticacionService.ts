import { SemillaRequest, SemillaResponse, ValidarSemillaRequest, ValidarSemillaResponse } from '../../shared/types/DGIITypes';

export interface IAutenticacionService {
  obtenerSemilla(request: SemillaRequest): Promise<SemillaResponse>;
  validarSemilla(request: ValidarSemillaRequest): Promise<ValidarSemillaResponse>;
  validarToken(token: string): Promise<boolean>;
  renovarToken(token: string): Promise<string>;
  revocarToken(token: string): Promise<void>;
  limpiarTokensExpirados(): Promise<number>;
}
