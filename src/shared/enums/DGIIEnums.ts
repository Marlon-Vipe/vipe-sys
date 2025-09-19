/**
 * Enums relacionados con la normativa DGII
 */

export enum TipoECF {
  FACTURA_CREDITO_FISCAL = 31,
  FACTURA_CONSUMO = 32,
  NOTA_DEBITO = 33,
  NOTA_CREDITO = 34,
  COMPROBANTE_COMPRAS = 41,
  REGISTRO_UNICO_INGRESOS = 43,
  COMPROBANTE_GUBERNAMENTAL = 44,
  COMPROBANTE_EXPORTACION = 45,
  COMPROBANTE_IMPORTACION = 46,
  OTROS_COMPROBANTES = 47,
}

export enum TipoPago {
  CONTADO = 1,
  CREDITO = 2,
}

export enum IndicadorFacturacion {
  GRAVADO = 1,
  EXENTO = 2,
  NO_FACTURABLE = 3,
}

export enum EstadoComprobante {
  NO_ENCONTRADO = 0,
  ACEPTADO = 1,
  RECHAZADO = 2,
  EN_PROCESO = 3,
  ACEPTADO_CONDICIONAL = 4,
}

export enum TipoDocumentoIdentidad {
  RNC = 'RNC',
  CEDULA = 'Cedula',
  PASAPORTE = 'Pasaporte',
}

export enum AmbienteDGII {
  PRE_CERT = 'pre-cert',
  CERT = 'cert',
  PROD = 'prod',
}

export enum TipoOperacion {
  EMISION = 'emision',
  RECEPCION = 'recepcion',
  CONSULTA = 'consulta',
  ANULACION = 'anulacion',
  APROBACION = 'aprobacion',
}

export enum CodigoErrorDGII {
  // Errores de autenticación
  CERTIFICADO_INVALIDO = 1001,
  TOKEN_EXPIRADO = 1002,
  SEMILLA_INVALIDA = 1003,
  
  // Errores de validación XML
  XML_MALFORMADO = 2001,
  XSD_INVALIDO = 2002,
  FIRMA_INVALIDA = 2003,
  
  // Errores de negocio
  RNC_INACTIVO = 3001,
  ENCF_VENCIDO = 3002,
  SECUENCIA_NO_AUTORIZADA = 3003,
  MONTO_EXCEDIDO = 3004,
  
  // Errores de sistema
  SERVICIO_NO_DISPONIBLE = 4001,
  TIMEOUT = 4002,
  ERROR_INTERNO = 4003,
}

export enum TipoConsulta {
  POR_TRACK_ID = 'trackId',
  POR_RNC = 'rnc',
  POR_ENCF = 'encf',
  POR_FECHA = 'fecha',
  POR_ESTADO = 'estado',
}

export enum TipoAprobacion {
  APROBACION_COMERCIAL = 'ACECF',
  ACUSE_RECIBO = 'ARECF',
  ANULACION = 'ANECF',
}
