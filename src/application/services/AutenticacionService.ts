import { IAutenticacionService } from '../../domain/services/IAutenticacionService';
import { ITokenSesionRepository } from '../../domain/repositories/ITokenSesionRepository';
import { ILogTransaccionRepository } from '../../domain/repositories/ILogTransaccionRepository';
import { TokenSesion } from '../../domain/entities/TokenSesion';
import { LogTransaccion } from '../../domain/entities/LogTransaccion';
import { SemillaRequest, SemillaResponse, ValidarSemillaRequest, ValidarSemillaResponse } from '../../shared/types/DGIITypes';
import { TipoOperacion } from '../../shared/enums/DGIIEnums';
import { DGII_CONSTANTS } from '../../shared/constants/DGIIConstants';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { config } from '../../shared/config/environment';

export class AutenticacionService implements IAutenticacionService {
  constructor(
    private tokenRepository: ITokenSesionRepository,
    private logRepository: ILogTransaccionRepository
  ) {}

  async obtenerSemilla(request: SemillaRequest): Promise<SemillaResponse> {
    const log = LogTransaccion.createInfo(
      'Solicitud de semilla de autenticación',
      { rnc: request.rnc },
      request.rnc
    );

    try {
      // Generar semilla aleatoria
      const semilla = crypto.randomBytes(32).toString('hex');
      const fecha = new Date().toISOString();

      const response: SemillaResponse = {
        valor: semilla,
        fecha: fecha
      };

      log.setRequestInfo('/api/autenticacion/semilla', 'GET');
      log.setResponseInfo(200, 0);
      await this.logRepository.create(log);

      return response;
    } catch (error) {
      log.setError(error as Error);
      log.setResponseInfo(500, 0);
      await this.logRepository.create(log);
      throw error;
    }
  }

  async validarSemilla(request: ValidarSemillaRequest): Promise<ValidarSemillaResponse> {
    const log = LogTransaccion.createInfo(
      'Validación de semilla firmada',
      { rnc: request.rnc },
      request.rnc
    );

    try {
      // Verificar que no exista un token activo para este RNC
      const tokenActivo = await this.tokenRepository.findActiveByRnc(request.rnc);
      if (tokenActivo) {
        tokenActivo.deactivate();
        await this.tokenRepository.update(tokenActivo);
      }

      // Validar la semilla firmada (implementar validación de firma digital)
      const esValida = await this.validarFirmaDigital(request.semillaFirmada, request.rnc);
      
      if (!esValida) {
        const errorLog = LogTransaccion.createError(
          'Semilla firmada inválida',
          { rnc: request.rnc, semillaFirmada: request.semillaFirmada },
          request.rnc
        );
        await this.logRepository.create(errorLog);

        return {
          trackId: crypto.randomUUID(),
          codigo: DGII_CONSTANTS.RESPONSE_CODES.RECHAZADO,
          estado: 'Rechazado',
          rnc: request.rnc,
          secuenciaUtilizada: false,
          fechaRecepcion: new Date().toISOString(),
          mensajes: [{
            valor: DGII_CONSTANTS.ERROR_MESSAGES.CERTIFICADO_INVALIDO,
            codigo: 1001
          }]
        };
      }

      // Generar token JWT
      const token = jwt.sign(
        { 
          rnc: request.rnc,
          iat: Math.floor(Date.now() / 1000)
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      // Crear registro de token en base de datos
      const tokenSesion = new TokenSesion();
      tokenSesion.rnc = request.rnc;
      tokenSesion.token = token;
      tokenSesion.fechaExpiracion = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
      
      await this.tokenRepository.create(tokenSesion);

      const response: ValidarSemillaResponse = {
        trackId: crypto.randomUUID(),
        codigo: DGII_CONSTANTS.RESPONSE_CODES.ACEPTADO,
        estado: 'Aceptado',
        rnc: request.rnc,
        secuenciaUtilizada: false,
        fechaRecepcion: new Date().toISOString(),
        mensajes: [{
          valor: 'Token generado exitosamente',
          codigo: 0
        }],
        token: token,
        expiracion: tokenSesion.fechaExpiracion.toISOString()
      };

      log.setRequestInfo('/api/autenticacion/validarsemilla', 'POST');
      log.setResponseInfo(200, 0);
      await this.logRepository.create(log);

      return response;
    } catch (error) {
      log.setError(error as Error);
      log.setResponseInfo(500, 0);
      await this.logRepository.create(log);
      throw error;
    }
  }

  async validarToken(token: string): Promise<boolean> {
    try {
      // Verificar JWT
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      
      // Verificar en base de datos
      const tokenSesion = await this.tokenRepository.findByToken(token);
      if (!tokenSesion || !tokenSesion.isActive()) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async renovarToken(token: string): Promise<string> {
    const tokenSesion = await this.tokenRepository.findByToken(token);
    if (!tokenSesion || !tokenSesion.isActive()) {
      throw new Error('Token inválido o expirado');
    }

    // Generar nuevo token
    const nuevoToken = jwt.sign(
      { 
        rnc: tokenSesion.rnc,
        iat: Math.floor(Date.now() / 1000)
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Actualizar registro
    tokenSesion.token = nuevoToken;
    tokenSesion.extendExpiration(1);
    await this.tokenRepository.update(tokenSesion);

    return nuevoToken;
  }

  async revocarToken(token: string): Promise<void> {
    const tokenSesion = await this.tokenRepository.findByToken(token);
    if (tokenSesion) {
      tokenSesion.deactivate();
      await this.tokenRepository.update(tokenSesion);
    }
  }

  async limpiarTokensExpirados(): Promise<number> {
    return await this.tokenRepository.deleteExpired();
  }

  private async validarFirmaDigital(semillaFirmada: string, rnc: string): Promise<boolean> {
    // TODO: Implementar validación real de firma digital
    // Por ahora, validación básica para desarrollo
    return semillaFirmada.length > 0 && rnc.length >= 9;
  }
}
