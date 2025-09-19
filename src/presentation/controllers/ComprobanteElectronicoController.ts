import { Request, Response } from 'express';
import { ComprobanteElectronicoService } from '../../application/services/ComprobanteElectronicoService';
import { ComprobanteElectronicoRepository } from '../../infrastructure/repositories/ComprobanteElectronicoRepository';
import { SecuenciaNCFRepository } from '../../infrastructure/repositories/SecuenciaNCFRepository';
import { ContribuyenteRepository } from '../../infrastructure/repositories/ContribuyenteRepository';
import { LogTransaccionRepository } from '../../infrastructure/repositories/LogTransaccionRepository';
import { 
  RecepcionECFDTO, 
  ConsultaEstadoDTO, 
  ConsultaTrackIdsDTO,
  AprobacionComercialDTO,
  AnulacionRangoDTO 
} from '../../application/dtos/ComprobanteElectronicoDTOs';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import multer from 'multer';

// Configurar multer para manejo de archivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/xml' || file.originalname.endsWith('.xml')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos XML'));
    }
  }
});

export class ComprobanteElectronicoController {
  private comprobanteService: ComprobanteElectronicoService;

  constructor() {
    const comprobanteRepository = new ComprobanteElectronicoRepository();
    const secuenciaRepository = new SecuenciaNCFRepository();
    const contribuyenteRepository = new ContribuyenteRepository();
    const logRepository = new LogTransaccionRepository();
    
    this.comprobanteService = new ComprobanteElectronicoService(
      comprobanteRepository,
      secuenciaRepository,
      contribuyenteRepository,
      logRepository
    );
  }

  // Middleware para manejo de archivos
  static uploadSingle = upload.single('file');

  async recibirECF(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          codigo: 400,
          estado: 'Archivo requerido',
          mensajes: [{
            valor: 'Debe proporcionar un archivo XML',
            codigo: 400
          }]
        });
        return;
      }

      const dto = plainToClass(RecepcionECFDTO, {
        rncEmisor: req.body.rncEmisor || (req as any).user?.rnc,
        nombreArchivo: req.file.originalname
      });

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

      const request = {
        archivo: req.file.buffer,
        nombreArchivo: req.file.originalname,
        rncEmisor: dto.rncEmisor
      };

      const response = await this.comprobanteService.recibirECF(request);
      
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

  async consultarEstado(req: Request, res: Response): Promise<void> {
    try {
      const dto = plainToClass(ConsultaEstadoDTO, req.query);
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

      const response = await this.comprobanteService.consultarEstado(dto);
      
      if (response.codigo === 0) {
        res.status(404).json(response);
      } else {
        res.status(200).json(response);
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

  async consultarTrackIds(req: Request, res: Response): Promise<void> {
    try {
      const dto = plainToClass(ConsultaTrackIdsDTO, req.query);
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

      // TODO: Implementar consulta de TrackIds
      res.json({
        trackIds: [],
        totalRegistros: 0
      });
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

  async consultarDirectorio(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implementar consulta de directorio
      res.json({
        contribuyentes: [],
        totalRegistros: 0,
        fechaActualizacion: new Date().toISOString()
      });
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

  async aprobacionComercial(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          codigo: 400,
          estado: 'Archivo requerido',
          mensajes: [{
            valor: 'Debe proporcionar un archivo XML',
            codigo: 400
          }]
        });
        return;
      }

      const dto = plainToClass(AprobacionComercialDTO, {
        rncEmisor: req.body.rncEmisor || (req as any).user?.rnc,
        nombreArchivo: req.file.originalname
      });

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

      // TODO: Implementar aprobación comercial
      res.json({
        trackId: 'uuid-here',
        codigo: 1,
        estado: 'Aceptado',
        rnc: dto.rncEmisor,
        secuenciaUtilizada: false,
        fechaRecepcion: new Date().toISOString(),
        mensajes: [{
          valor: 'Aprobación comercial procesada exitosamente',
          codigo: 0
        }]
      });
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

  async anularRango(req: Request, res: Response): Promise<void> {
    try {
      const dto = plainToClass(AnulacionRangoDTO, req.body);
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

      // TODO: Implementar anulación de rango
      res.json({
        trackId: 'uuid-here',
        codigo: 1,
        estado: 'Aceptado',
        rnc: dto.rncEmisor,
        secuenciaUtilizada: false,
        fechaRecepcion: new Date().toISOString(),
        mensajes: [{
          valor: 'Rango de secuencias anulado exitosamente',
          codigo: 0
        }],
        secuenciasAnuladas: [dto.secuenciaDesde, dto.secuenciaHasta],
        fechaAnulacion: new Date().toISOString()
      });
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

  async obtenerEstatusServicios(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implementar estatus de servicios
      res.json({
        servicios: [
          {
            nombre: 'Recepción e-CF',
            estado: 'activo',
            ultimaActualizacion: new Date().toISOString()
          },
          {
            nombre: 'Consultas',
            estado: 'activo',
            ultimaActualizacion: new Date().toISOString()
          }
        ],
        fechaConsulta: new Date().toISOString()
      });
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
}
