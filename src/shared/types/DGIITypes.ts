/**
 * Tipos TypeScript para la API de Facturación Electrónica DGII
 */

import { TipoECF, TipoPago, IndicadorFacturacion, EstadoComprobante, TipoDocumentoIdentidad } from '../enums/DGIIEnums';

// Tipos base
export interface BaseResponse {
  trackId: string;
  codigo: number;
  estado: string;
  rnc?: string;
  encf?: string;
  secuenciaUtilizada: boolean;
  fechaRecepcion: string;
  mensajes: Mensaje[];
}

export interface Mensaje {
  valor: string;
  codigo: number;
}

// Tipos para autenticación
export interface SemillaRequest {
  rnc: string;
}

export interface SemillaResponse {
  valor: string;
  fecha: string;
}

export interface ValidarSemillaRequest {
  rnc: string;
  semillaFirmada: string;
}

export interface ValidarSemillaResponse extends BaseResponse {
  token: string;
  expiracion: string;
}

// Tipos para documentos electrónicos
export interface DocumentoElectronico {
  tipoECF: TipoECF;
  encf: string;
  fechaVencimientoSecuencia: string;
  tipoPago: TipoPago;
  fechaLimitePago?: string;
  emisor: Emisor;
  comprador: Comprador;
  totales: Totales;
  detallesItems: DetalleItem[];
  informacionReferencia?: InformacionReferencia;
  fechaHoraFirma: string;
}

export interface Emisor {
  rncEmisor: string;
  razonSocialEmisor: string;
  direccionEmisor: string;
  fechaEmision: string;
}

export interface Comprador {
  rncComprador: string;
  razonSocialComprador: string;
}

export interface Totales {
  montoGravadoTotal: number;
  montoExento: number;
  totalITBIS: number;
  montoTotal: number;
  totalITBISRetenido?: number;
  totalISRRetencion?: number;
}

export interface DetalleItem {
  numeroLinea: number;
  indicadorFacturacion: IndicadorFacturacion;
  nombreItem: string;
  cantidadItem: number;
  precioUnitarioItem: number;
  montoItem: number;
}

export interface InformacionReferencia {
  tipoECFReferencia: TipoECF;
  encfReferencia: string;
  fechaEmisionReferencia: string;
  motivoReferencia: string;
}

// Tipos para recepción de documentos
export interface RecepcionECFRequest {
  archivo: Buffer;
  nombreArchivo: string;
  rncEmisor: string;
}

export interface RecepcionECFResponse extends BaseResponse {
  archivoRespuesta?: Buffer;
  nombreArchivoRespuesta?: string;
}

// Tipos para consultas
export interface ConsultaEstadoRequest {
  trackId?: string;
  rnc?: string;
  encf?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  estado?: EstadoComprobante;
}

export interface ConsultaEstadoResponse extends BaseResponse {
  fechaProcesamiento?: string;
  archivoRespuesta?: Buffer;
  nombreArchivoRespuesta?: string;
}

export interface ConsultaTrackIdsRequest {
  rnc: string;
  encf?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface ConsultaTrackIdsResponse {
  trackIds: TrackIdInfo[];
  totalRegistros: number;
}

export interface TrackIdInfo {
  trackId: string;
  encf: string;
  fechaRecepcion: string;
  estado: EstadoComprobante;
  montoTotal: number;
}

// Tipos para aprobación comercial
export interface AprobacionComercialRequest {
  archivo: Buffer;
  nombreArchivo: string;
  rncEmisor: string;
}

export interface AprobacionComercialResponse extends BaseResponse {
  archivoRespuesta?: Buffer;
  nombreArchivoRespuesta?: string;
}

// Tipos para anulación
export interface AnulacionRangoRequest {
  rncEmisor: string;
  tipoECF: TipoECF;
  secuenciaDesde: string;
  secuenciaHasta: string;
  motivoAnulacion: string;
}

export interface AnulacionRangoResponse extends BaseResponse {
  secuenciasAnuladas: string[];
  fechaAnulacion: string;
}

// Tipos para directorio
export interface ConsultaDirectorioRequest {
  rnc?: string;
  fechaActualizacion?: string;
}

export interface ConsultaDirectorioResponse {
  contribuyentes: ContribuyenteInfo[];
  totalRegistros: number;
  fechaActualizacion: string;
}

export interface ContribuyenteInfo {
  rnc: string;
  razonSocial: string;
  nombreComercial?: string;
  tipoDocumento: TipoDocumentoIdentidad;
  estado: string;
  fechaActualizacion: string;
}

// Tipos para estatus de servicios
export interface EstatusServiciosResponse {
  servicios: ServicioEstatus[];
  fechaConsulta: string;
}

export interface ServicioEstatus {
  nombre: string;
  estado: 'activo' | 'inactivo' | 'mantenimiento';
  ultimaActualizacion: string;
  mensaje?: string;
}

export interface VentanaMantenimiento {
  servicio: string;
  fechaInicio: string;
  fechaFin: string;
  motivo: string;
}

// Tipos para validación
export interface ValidacionResult {
  esValido: boolean;
  errores: string[];
  advertencias: string[];
}

export interface ValidacionXMLResult extends ValidacionResult {
  estructuraValida: boolean;
  xsdValido: boolean;
  firmaValida: boolean;
}

// Tipos para logging
export interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  context?: Record<string, any>;
  trackId?: string;
  rnc?: string;
  encf?: string;
}

// Tipos para configuración
export interface DGIIEnvironment {
  name: string;
  baseUrl: string;
  isProduction: boolean;
  maxRetries: number;
  timeout: number;
}

// Tipos para certificados digitales
export interface CertificadoDigital {
  rnc: string;
  serialNumber: string;
  fechaVencimiento: string;
  archivo: Buffer;
  password: string;
  valido: boolean;
}

// Tipos para rate limiting
export interface RateLimitInfo {
  rnc: string;
  requests: number;
  windowStart: Date;
  windowEnd: Date;
  limit: number;
}

// Tipos para cache
export interface CacheEntry<T> {
  key: string;
  value: T;
  ttl: number;
  createdAt: Date;
  expiresAt: Date;
}

// Tipos para métricas
export interface MetricasAPI {
  totalRequests: number;
  requestsExitosos: number;
  requestsFallidos: number;
  tiempoPromedioRespuesta: number;
  requestsPorMinuto: number;
  erroresPorTipo: Record<string, number>;
}

export default DGIITypes;
