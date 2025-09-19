/**
 * Constantes relacionadas con la normativa DGII
 */

export const DGII_CONSTANTS = {
  // URLs base por ambiente
  URLS: {
    PRE_CERT: 'https://ecf.dgii.gov.do/testecf/',
    CERT: 'https://ecf.dgii.gov.do/certecf/',
    PROD: 'https://ecf.dgii.gov.do/ecf/',
  },

  // Endpoints de la API DGII
  ENDPOINTS: {
    // Autenticación
    SEMILLA: 'api/autenticacion/semilla',
    VALIDAR_SEMILLA: 'api/autenticacion/validarsemilla',
    
    // Recepción de documentos
    FACTURAS_ELECTRONICAS: 'api/facturaselectronicas',
    RECEPCION_ECF: 'api/recepcion/ecf',
    
    // Consultas
    CONSULTA_ESTADO: 'api/consultas/estado',
    CONSULTA_TRACK_IDS: 'api/trackids/consulta',
    CONSULTA_RESUMEN: 'api/Consultas/Consulta',
    
    // Aprobación y anulación
    APROBACION_COMERCIAL: 'api/aprobacioncomercial',
    ANULAR_RANGO: 'api/operaciones/anularrango',
    
    // Directorio
    LISTADO_CONTRIBUYENTES: 'api/consultas/listado',
    DIRECTORIO_POR_RNC: 'api/consultas/obtenerdirectorioporrnc',
    
    // Estatus de servicios
    ESTATUS_SERVICIOS: 'api/estatusservicios/obtenerestatus',
    VENTANAS_MANTENIMIENTO: 'api/estatusservicios/obtenerventanasmantenimiento',
    VERIFICAR_ESTADO: 'api/estatusservicios/verificarestado',
  },

  // Límites y restricciones
  LIMITS: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_ITEMS_PER_INVOICE: 1000,
    MAX_RNC_LENGTH: 11,
    MIN_RNC_LENGTH: 9,
    MAX_RAZON_SOCIAL_LENGTH: 150,
    MAX_DIRECCION_LENGTH: 100,
    MAX_NOMBRE_ITEM_LENGTH: 80,
    MAX_DESCRIPCION_LENGTH: 200,
  },

  // Formatos de fecha
  DATE_FORMATS: {
    DGII_DATE: 'DD-MM-YYYY',
    DGII_DATETIME: 'DD-MM-YYYY HH:mm:ss',
    ISO_DATETIME: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  },

  // Códigos de respuesta estándar
  RESPONSE_CODES: {
    NO_ENCONTRADO: 0,
    ACEPTADO: 1,
    RECHAZADO: 2,
    EN_PROCESO: 3,
    ACEPTADO_CONDICIONAL: 4,
  },

  // Mensajes de error estándar
  ERROR_MESSAGES: {
    CERTIFICADO_INVALIDO: 'Certificado digital inválido o expirado',
    XML_MALFORMADO: 'El archivo XML no cumple con la estructura requerida',
    RNC_INACTIVO: 'El RNC del emisor no está activo o autorizado',
    ENCF_VENCIDO: 'La secuencia de eNCF ha vencido',
    SECUENCIA_NO_AUTORIZADA: 'La secuencia no está autorizada para este contribuyente',
    MONTO_EXCEDIDO: 'El monto excede el límite permitido para FC',
    SERVICIO_NO_DISPONIBLE: 'El servicio no está disponible en este momento',
    TIMEOUT: 'Tiempo de espera agotado',
    ERROR_INTERNO: 'Error interno del servidor',
  },

  // Configuración de validación XML
  XML_VALIDATION: {
    PRESERVE_WHITESPACE: false,
    ENCODING: 'UTF-8',
    VERSION: '1.0',
  },

  // Configuración de firma digital
  DIGITAL_SIGNATURE: {
    ALGORITHM: 'SHA256',
    CANONICALIZATION_METHOD: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    SIGNATURE_METHOD: 'http://www.w3.org/2000/09/xmldsig#rsa-sha1',
    TRANSFORM_METHOD: 'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
  },

  // Caracteres especiales que deben ser escapados
  SPECIAL_CHARACTERS: {
    QUOTE: { original: '"', escaped: '&#34;', hex: '&#x22;' },
    AMPERSAND: { original: '&', escaped: '&#38;', hex: '&#x26;' },
    APOSTROPHE: { original: "'", escaped: '&#39;', hex: '&#x27;' },
    LESS_THAN: { original: '<', escaped: '&#60;', hex: '&#x3C;' },
    GREATER_THAN: { original: '>', escaped: '&#62;', hex: '&#x3E;' },
  },

  // Configuración de rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutos
    MAX_REQUESTS: 100,
    SKIP_SUCCESSFUL_REQUESTS: false,
  },

  // Configuración de cache
  CACHE: {
    TTL: 3600, // 1 hora
    PREFIX: 'dgii:',
  },

  // Configuración de logging
  LOGGING: {
    LEVELS: ['error', 'warn', 'info', 'debug'],
    MAX_FILES: 5,
    MAX_SIZE: '10m',
  },
};

export default DGII_CONSTANTS;
