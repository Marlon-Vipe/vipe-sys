import { Request, Response, NextFunction } from 'express';
import { AutenticacionService } from '../../application/services/AutenticacionService';
import { TokenSesionRepository } from '../../infrastructure/repositories/TokenSesionRepository';
import { LogTransaccionRepository } from '../../infrastructure/repositories/LogTransaccionRepository';

export class AuthMiddleware {
  private autenticacionService: AutenticacionService;

  constructor() {
    const tokenRepository = new TokenSesionRepository();
    const logRepository = new LogTransaccionRepository();
    this.autenticacionService = new AutenticacionService(tokenRepository, logRepository);
  }

  async validateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          codigo: 401,
          estado: 'Token de autorización requerido',
          mensajes: [{
            valor: 'Debe proporcionar un token Bearer válido',
            codigo: 401
          }]
        });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      const isValid = await this.autenticacionService.validarToken(token);
      
      if (!isValid) {
        res.status(401).json({
          codigo: 401,
          estado: 'Token inválido o expirado',
          mensajes: [{
            valor: 'El token proporcionado no es válido o ha expirado',
            codigo: 401
          }]
        });
        return;
      }

      // Decodificar el token para obtener información del usuario
      const jwt = require('jsonwebtoken');
      const decoded = jwt.decode(token) as any;
      
      // Agregar información del usuario al request
      (req as any).user = {
        rnc: decoded.rnc,
        token: token
      };

      next();
    } catch (error) {
      res.status(500).json({
        codigo: 500,
        estado: 'Error interno del servidor',
        mensajes: [{
          valor: 'Error al validar el token',
          codigo: 500
        }]
      });
    }
  }

  async validateRNC(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rnc = req.params.rnc || req.body.rnc || req.query.rnc;
      
      if (!rnc) {
        res.status(400).json({
          codigo: 400,
          estado: 'RNC requerido',
          mensajes: [{
            valor: 'Debe proporcionar un RNC válido',
            codigo: 400
          }]
        });
        return;
      }

      // Validar formato de RNC
      if (!/^\d{9}$|^\d{11}$/.test(rnc)) {
        res.status(400).json({
          codigo: 400,
          estado: 'Formato de RNC inválido',
          mensajes: [{
            valor: 'El RNC debe tener 9 o 11 dígitos',
            codigo: 400
          }]
        });
        return;
      }

      // Verificar que el RNC del token coincida con el RNC de la petición
      const user = (req as any).user;
      if (user && user.rnc !== rnc) {
        res.status(403).json({
          codigo: 403,
          estado: 'Acceso denegado',
          mensajes: [{
            valor: 'No tiene permisos para acceder a este RNC',
            codigo: 403
          }]
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({
        codigo: 500,
        estado: 'Error interno del servidor',
        mensajes: [{
          valor: 'Error al validar el RNC',
          codigo: 500
        }]
      });
    }
  }
}
