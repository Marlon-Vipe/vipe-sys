import { IComprobanteElectronicoService } from '../../domain/services/IComprobanteElectronicoService';
import { IComprobanteElectronicoRepository } from '../../domain/repositories/IComprobanteElectronicoRepository';
import { ISecuenciaNCFRepository } from '../../domain/repositories/ISecuenciaNCFRepository';
import { IContribuyenteRepository } from '../../domain/repositories/IContribuyenteRepository';
import { ILogTransaccionRepository } from '../../domain/repositories/ILogTransaccionRepository';
import { ComprobanteElectronico } from '../../domain/entities/ComprobanteElectronico';
import { LogTransaccion } from '../../domain/entities/LogTransaccion';
import { 
  RecepcionECFRequest, 
  RecepcionECFResponse, 
  ConsultaEstadoRequest, 
  ConsultaEstadoResponse,
  ValidacionXMLResult 
} from '../../shared/types/DGIITypes';
import { TipoOperacion, EstadoComprobante } from '../../shared/enums/DGIIEnums';
import { DGII_CONSTANTS } from '../../shared/constants/DGIIConstants';
import * as crypto from 'crypto';
import * as xml2js from 'xml2js';
import * as fs from 'fs';
import * as path from 'path';

export class ComprobanteElectronicoService implements IComprobanteElectronicoService {
  constructor(
    private comprobanteRepository: IComprobanteElectronicoRepository,
    private secuenciaRepository: ISecuenciaNCFRepository,
    private contribuyenteRepository: IContribuyenteRepository,
    private logRepository: ILogTransaccionRepository
  ) {}

  async recibirECF(request: RecepcionECFRequest): Promise<RecepcionECFResponse> {
    const trackId = crypto.randomUUID();
    const log = LogTransaccion.createInfo(
      'Recepción de e-CF',
      { 
        rncEmisor: request.rncEmisor,
        nombreArchivo: request.nombreArchivo,
        trackId 
      },
      request.rncEmisor,
      trackId
    );

    try {
      // Validar RNC del emisor
      const contribuyente = await this.contribuyenteRepository.findByRnc(request.rncEmisor);
      if (!contribuyente || !contribuyente.canEmit()) {
        const errorLog = LogTransaccion.createError(
          'RNC emisor no autorizado',
          { rncEmisor: request.rncEmisor },
          request.rncEmisor,
          trackId
        );
        await this.logRepository.create(errorLog);

        return {
          trackId,
          codigo: DGII_CONSTANTS.RESPONSE_CODES.RECHAZADO,
          estado: 'Rechazado',
          rnc: request.rncEmisor,
          secuenciaUtilizada: false,
          fechaRecepcion: new Date().toISOString(),
          mensajes: [{
            valor: DGII_CONSTANTS.ERROR_MESSAGES.RNC_INACTIVO,
            codigo: 3001
          }]
        };
      }

      // Validar XML
      const xmlContent = request.archivo.toString('utf-8');
      const validacion = await this.validarXML(xmlContent);
      
      if (!validacion.esValido) {
        const errorLog = LogTransaccion.createError(
          'XML inválido',
          { 
            errores: validacion.errores,
            rncEmisor: request.rncEmisor 
          },
          request.rncEmisor,
          trackId
        );
        await this.logRepository.create(errorLog);

        return {
          trackId,
          codigo: DGII_CONSTANTS.RESPONSE_CODES.RECHAZADO,
          estado: 'Rechazado',
          rnc: request.rncEmisor,
          secuenciaUtilizada: false,
          fechaRecepcion: new Date().toISOString(),
          mensajes: validacion.errores.map(error => ({
            valor: error,
            codigo: 2001
          }))
        };
      }

      // Parsear XML para extraer información
      const xmlData = await this.parsearXML(xmlContent);
      const encf = xmlData.Encabezado?.IdDoc?.eNCF?.[0];
      const tipoECF = xmlData.Encabezado?.IdDoc?.TipoECF?.[0];

      if (!encf || !tipoECF) {
        const errorLog = LogTransaccion.createError(
          'XML sin información de eNCF o TipoECF',
          { xmlData },
          request.rncEmisor,
          trackId
        );
        await this.logRepository.create(errorLog);

        return {
          trackId,
          codigo: DGII_CONSTANTS.RESPONSE_CODES.RECHAZADO,
          estado: 'Rechazado',
          rnc: request.rncEmisor,
          secuenciaUtilizada: false,
          fechaRecepcion: new Date().toISOString(),
          mensajes: [{
            valor: 'XML no contiene información de eNCF o TipoECF válida',
            codigo: 2001
          }]
        };
      }

      // Verificar si ya existe un comprobante con este eNCF
      const comprobanteExistente = await this.comprobanteRepository.findByRncAndEncf(
        request.rncEmisor, 
        encf
      );

      if (comprobanteExistente) {
        const errorLog = LogTransaccion.createError(
          'eNCF ya existe',
          { encf, rncEmisor: request.rncEmisor },
          request.rncEmisor,
          trackId
        );
        await this.logRepository.create(errorLog);

        return {
          trackId,
          codigo: DGII_CONSTANTS.RESPONSE_CODES.RECHAZADO,
          estado: 'Rechazado',
          rnc: request.rncEmisor,
          encf,
          secuenciaUtilizada: false,
          fechaRecepcion: new Date().toISOString(),
          mensajes: [{
            valor: 'El eNCF ya existe en el sistema',
            codigo: 3003
          }]
        };
      }

      // Validar y usar secuencia
      const secuenciaValida = await this.secuenciaRepository.canUseSecuencia(
        request.rncEmisor,
        encf,
        parseInt(tipoECF)
      );

      if (!secuenciaValida) {
        const errorLog = LogTransaccion.createError(
          'Secuencia no autorizada',
          { encf, tipoECF, rncEmisor: request.rncEmisor },
          request.rncEmisor,
          trackId
        );
        await this.logRepository.create(errorLog);

        return {
          trackId,
          codigo: DGII_CONSTANTS.RESPONSE_CODES.RECHAZADO,
          estado: 'Rechazado',
          rnc: request.rncEmisor,
          encf,
          secuenciaUtilizada: false,
          fechaRecepcion: new Date().toISOString(),
          mensajes: [{
            valor: DGII_CONSTANTS.ERROR_MESSAGES.SECUENCIA_NO_AUTORIZADA,
            codigo: 3003
          }]
        };
      }

      // Usar secuencia
      await this.secuenciaRepository.useSecuencia(
        request.rncEmisor,
        encf,
        parseInt(tipoECF)
      );

      // Crear comprobante
      const comprobante = new ComprobanteElectronico();
      comprobante.trackId = trackId;
      comprobante.rncEmisor = request.rncEmisor;
      comprobante.encf = encf;
      comprobante.tipoECF = parseInt(tipoECF);
      comprobante.razonSocialEmisor = contribuyente.razonSocial;
      comprobante.rncComprador = xmlData.Encabezado?.Comprador?.RNCComprador?.[0];
      comprobante.razonSocialComprador = xmlData.Encabezado?.Comprador?.RazonSocialComprador?.[0];
      comprobante.montoTotal = parseFloat(xmlData.Encabezado?.Totales?.MontoTotal?.[0] || '0');
      comprobante.totalITBIS = parseFloat(xmlData.Encabezado?.Totales?.TotalITBIS?.[0] || '0');
      comprobante.estado = EstadoComprobante.EN_PROCESO;
      comprobante.fechaEmision = new Date(xmlData.Encabezado?.Emisor?.FechaEmision?.[0] || new Date());
      comprobante.fechaRecepcion = new Date();
      comprobante.xmlOriginal = xmlContent;
      comprobante.nombreArchivoOriginal = request.nombreArchivo;
      comprobante.secuenciaUtilizada = true;

      await this.comprobanteRepository.create(comprobante);

      const response: RecepcionECFResponse = {
        trackId,
        codigo: DGII_CONSTANTS.RESPONSE_CODES.ACEPTADO,
        estado: 'Aceptado',
        rnc: request.rncEmisor,
        encf,
        secuenciaUtilizada: true,
        fechaRecepcion: comprobante.fechaRecepcion.toISOString(),
        mensajes: [{
          valor: 'Documento recibido exitosamente',
          codigo: 0
        }]
      };

      log.setRequestInfo('/api/facturaselectronicas', 'POST');
      log.setResponseInfo(200, 0);
      log.setFileInfo(request.nombreArchivo, request.archivo.length);
      await this.logRepository.create(log);

      return response;
    } catch (error) {
      log.setError(error as Error);
      log.setResponseInfo(500, 0);
      await this.logRepository.create(log);

      return {
        trackId,
        codigo: DGII_CONSTANTS.RESPONSE_CODES.RECHAZADO,
        estado: 'Rechazado',
        rnc: request.rncEmisor,
        secuenciaUtilizada: false,
        fechaRecepcion: new Date().toISOString(),
        mensajes: [{
          valor: DGII_CONSTANTS.ERROR_MESSAGES.ERROR_INTERNO,
          codigo: 4003
        }]
      };
    }
  }

  async consultarEstado(request: ConsultaEstadoRequest): Promise<ConsultaEstadoResponse> {
    const log = LogTransaccion.createInfo(
      'Consulta de estado',
      request,
      request.rnc
    );

    try {
      let comprobante: ComprobanteElectronico | null = null;

      if (request.trackId) {
        comprobante = await this.comprobanteRepository.findByTrackId(request.trackId);
      } else if (request.rnc && request.encf) {
        comprobante = await this.comprobanteRepository.findByRncAndEncf(request.rnc, request.encf);
      }

      if (!comprobante) {
        const errorLog = LogTransaccion.createError(
          'Comprobante no encontrado',
          request,
          request.rnc
        );
        await this.logRepository.create(errorLog);

        return {
          trackId: request.trackId || crypto.randomUUID(),
          codigo: DGII_CONSTANTS.RESPONSE_CODES.NO_ENCONTRADO,
          estado: 'No encontrado',
          rnc: request.rnc,
          encf: request.encf,
          secuenciaUtilizada: false,
          fechaRecepcion: new Date().toISOString(),
          mensajes: [{
            valor: 'No se encontró el comprobante solicitado',
            codigo: 0
          }]
        };
      }

      const response: ConsultaEstadoResponse = {
        trackId: comprobante.trackId,
        codigo: comprobante.estado,
        estado: this.getEstadoString(comprobante.estado),
        rnc: comprobante.rncEmisor,
        encf: comprobante.encf,
        secuenciaUtilizada: comprobante.secuenciaUtilizada,
        fechaRecepcion: comprobante.fechaRecepcion.toISOString(),
        fechaProcesamiento: comprobante.fechaProcesamiento?.toISOString(),
        mensajes: comprobante.mensajeEstado ? [{
          valor: comprobante.mensajeEstado,
          codigo: comprobante.estado
        }] : []
      };

      if (comprobante.xmlRespuesta) {
        response.archivoRespuesta = Buffer.from(comprobante.xmlRespuesta);
        response.nombreArchivoRespuesta = comprobante.nombreArchivoRespuesta;
      }

      log.setRequestInfo('/api/consultas/estado', 'GET');
      log.setResponseInfo(200, 0);
      await this.logRepository.create(log);

      return response;
    } catch (error) {
      log.setError(error as Error);
      log.setResponseInfo(500, 0);
      await this.logRepository.create(log);

      return {
        trackId: request.trackId || crypto.randomUUID(),
        codigo: DGII_CONSTANTS.RESPONSE_CODES.RECHAZADO,
        estado: 'Error',
        rnc: request.rnc,
        encf: request.encf,
        secuenciaUtilizada: false,
        fechaRecepcion: new Date().toISOString(),
        mensajes: [{
          valor: DGII_CONSTANTS.ERROR_MESSAGES.ERROR_INTERNO,
          codigo: 4003
        }]
      };
    }
  }

  async validarXML(xmlContent: string): Promise<ValidacionXMLResult> {
    const errores: string[] = [];
    const advertencias: string[] = [];

    try {
      // Validar estructura básica del XML
      const parser = new xml2js.Parser({
        explicitArray: true,
        trim: true,
        normalize: true
      });

      const result = await parser.parseStringPromise(xmlContent);
      
      // Validar elementos requeridos
      if (!result.ECF) {
        errores.push('El XML debe contener un elemento raíz ECF');
      }

      if (!result.ECF?.Encabezado) {
        errores.push('El XML debe contener un elemento Encabezado');
      }

      if (!result.ECF?.DetallesItems) {
        errores.push('El XML debe contener un elemento DetallesItems');
      }

      // Validar estructura del Encabezado
      if (result.ECF?.Encabezado) {
        const encabezado = result.ECF.Encabezado[0];
        
        if (!encabezado.IdDoc) {
          errores.push('El Encabezado debe contener IdDoc');
        }

        if (!encabezado.Emisor) {
          errores.push('El Encabezado debe contener Emisor');
        }

        if (!encabezado.Totales) {
          errores.push('El Encabezado debe contener Totales');
        }
      }

      // TODO: Implementar validación XSD
      // TODO: Implementar validación de firma digital

      return {
        esValido: errores.length === 0,
        errores,
        advertencias,
        estructuraValida: errores.length === 0,
        xsdValido: true, // TODO: Implementar validación XSD
        firmaValida: true // TODO: Implementar validación de firma
      };
    } catch (error) {
      errores.push(`Error al parsear XML: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      
      return {
        esValido: false,
        errores,
        advertencias,
        estructuraValida: false,
        xsdValido: false,
        firmaValida: false
      };
    }
  }

  async procesarComprobante(trackId: string): Promise<void> {
    const comprobante = await this.comprobanteRepository.findByTrackId(trackId);
    
    if (!comprobante) {
      throw new Error('Comprobante no encontrado');
    }

    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));

    comprobante.markAsProcessed();
    await this.comprobanteRepository.update(comprobante);
  }

  async generarAcuseRecibo(trackId: string): Promise<Buffer> {
    const comprobante = await this.comprobanteRepository.findByTrackId(trackId);
    
    if (!comprobante) {
      throw new Error('Comprobante no encontrado');
    }

    // TODO: Implementar generación de acuse de recibo XML
    const acuseRecibo = `<?xml version="1.0" encoding="UTF-8"?>
<ARECF>
  <TrackId>${trackId}</TrackId>
  <FechaRecepcion>${comprobante.fechaRecepcion.toISOString()}</FechaRecepcion>
  <Estado>Aceptado</Estado>
</ARECF>`;

    return Buffer.from(acuseRecibo, 'utf-8');
  }

  async generarAprobacionComercial(trackId: string): Promise<Buffer> {
    const comprobante = await this.comprobanteRepository.findByTrackId(trackId);
    
    if (!comprobante) {
      throw new Error('Comprobante no encontrado');
    }

    // TODO: Implementar generación de aprobación comercial XML
    const aprobacionComercial = `<?xml version="1.0" encoding="UTF-8"?>
<ACECF>
  <TrackId>${trackId}</TrackId>
  <FechaAprobacion>${new Date().toISOString()}</FechaAprobacion>
  <Estado>Aprobado</Estado>
</ACECF>`;

    return Buffer.from(aprobacionComercial, 'utf-8');
  }

  private async parsearXML(xmlContent: string): Promise<any> {
    const parser = new xml2js.Parser({
      explicitArray: true,
      trim: true,
      normalize: true
    });

    return await parser.parseStringPromise(xmlContent);
  }

  private getEstadoString(estado: EstadoComprobante): string {
    switch (estado) {
      case EstadoComprobante.NO_ENCONTRADO:
        return 'No encontrado';
      case EstadoComprobante.ACEPTADO:
        return 'Aceptado';
      case EstadoComprobante.RECHAZADO:
        return 'Rechazado';
      case EstadoComprobante.EN_PROCESO:
        return 'En proceso';
      case EstadoComprobante.ACEPTADO_CONDICIONAL:
        return 'Aceptado condicional';
      default:
        return 'Desconocido';
    }
  }
}
