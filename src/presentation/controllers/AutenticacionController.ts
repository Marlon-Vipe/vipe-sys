import { Request, Response } from 'express';
import { AutenticacionService } from '../../application/services/AutenticacionService';
import { ObtenerSemillaDTO, ValidarSemillaDTO, RenovarTokenDTO, RevocarTokenDTO } from '../../application/dtos/AutenticacionDTOs';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class AutenticacionController {
  constructor(private autenticacionService: AutenticacionService) {}

  async obtenerSemilla(req: Request, res: Response): Promise<void> {
    try {
      const dto = plainToClass(ObtenerSemillaDTO, req.query);
      const errors = await validate(dto);

      if (errors.length > 0) {
        res.status(400).json({
          codigo: 400,
          estado: 'Error de validación',
          mensajes: errors.map(error => ({
            valor: Object.values(error.constraints || {}).join(', '),
            codigo: 400
          }))
        });
        return;
      }

      const response = await this.autenticacionService.obtenerSemilla(dto);
      res.json(response);
    } catch (error) {
      res.status(500).json({
        codigo: 500,
        estado: 'Error interno del servidor',
        mensajes: [{
          valor: error instanceof Error ? error.message : 'Error desconocido',
          codigo: 500
        }]
      });
    }
  }

  async validarSemilla(req: Request, res: Response): Promise<void> {
    try {
      const dto = plainToClass(ValidarSemillaDTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        res.status(400).json({
          codigo: 400,
          estado: 'Error de validación',
          mensajes: errors.map(error => ({
            valor: Object.values(error.constraints || {}).join(', '),
            codigo: 400
          }))
        });
        return;
      }

      const response = await this.autenticacionService.validarSemilla(dto);
      
      if (response.codigo === 1) {
        res.status(200).json(response);
      } else {
        res.status(400).json(response);
      }
    } catch (error) {
      res.status(500).json({
        codigo: 500,
        estado: 'Error interno del servidor',
        mensajes: [{
          valor: error instanceof Error ? error.message : 'Error desconocido',
          codigo: 500
        }]
      });
    }
  }

  async renovarToken(req: Request, res: Response): Promise<void> {
    try {
      const dto = plainToClass(RenovarTokenDTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        res.status(400).json({
          codigo: 400,
          estado: 'Error de validación',
          mensajes: errors.map(error => ({
            valor: Object.values(error.constraints || {}).join(', '),
            codigo: 400
          }))
        });
        return;
      }

      const nuevoToken = await this.autenticacionService.renovarToken(dto.token);
      
      res.json({
        codigo: 200,
        estado: 'Token renovado exitosamente',
        token: nuevoToken,
        mensajes: [{
          valor: 'Token renovado correctamente',
          codigo: 0
        }]
      });
    } catch (error) {
      res.status(400).json({
        codigo: 400,
        estado: 'Error al renovar token',
        mensajes: [{
          valor: error instanceof Error ? error.message : 'Error desconocido',
          codigo: 400
        }]
      });
    }
  }

  async revocarToken(req: Request, res: Response): Promise<void> {
    try {
      const dto = plainToClass(RevocarTokenDTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        res.status(400).json({
          codigo: 400,
          estado: 'Error de validación',
          mensajes: errors.map(error => ({
            valor: Object.values(error.constraints || {}).join(', '),
            codigo: 400
          }))
        });
        return;
      }

      await this.autenticacionService.revocarToken(dto.token);
      
      res.json({
        codigo: 200,
        estado: 'Token revocado exitosamente',
        mensajes: [{
          valor: 'Token revocado correctamente',
          codigo: 0
        }]
      });
    } catch (error) {
      res.status(400).json({
        codigo: 400,
        estado: 'Error al revocar token',
        mensajes: [{
          valor: error instanceof Error ? error.message : 'Error desconocido',
          codigo: 400
        }]
      });
    }
  }
}
