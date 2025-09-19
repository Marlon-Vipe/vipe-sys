# API de Facturación Electrónica DGII - Documentación

## 📋 Resumen

Esta API implementa todos los servicios requeridos por la Dirección General de Impuestos Internos (DGII) de República Dominicana para la facturación electrónica, siguiendo la normativa versión 1.6 de junio 2023.

## 🏗️ Arquitectura

### Stack Tecnológico
- **Backend**: Node.js + TypeScript + Express.js
- **Base de Datos**: PostgreSQL
- **Cache**: Redis
- **Autenticación**: JWT + Certificados Digitales
- **Validación**: class-validator + XSD
- **Testing**: Jest + Supertest

### Principios de Diseño
- **Clean Architecture**: Separación clara de responsabilidades
- **Domain-Driven Design**: Modelado basado en el dominio fiscal
- **SOLID Principles**: Código mantenible y extensible
- **Security First**: Cumplimiento de auditorías DGII

## 🔌 Endpoints de la API

### Base URL
```
Desarrollo: http://localhost:3000
Producción: https://api.vipe-dgii.com
```

### 1. Autenticación

#### Obtener Semilla
```http
GET /api/autenticacion/semilla?rnc=123456789
```

**Respuesta:**
```json
{
  "valor": "a1b2c3d4e5f6...",
  "fecha": "2023-12-19T10:30:00.000Z"
}
```

#### Validar Semilla
```http
POST /api/autenticacion/validarsemilla
Content-Type: application/json

{
  "rnc": "123456789",
  "semillaFirmada": "signed-seed-value"
}
```

**Respuesta:**
```json
{
  "trackId": "uuid-here",
  "codigo": 1,
  "estado": "Aceptado",
  "rnc": "123456789",
  "secuenciaUtilizada": false,
  "fechaRecepcion": "2023-12-19T10:30:00.000Z",
  "mensajes": [
    {
      "valor": "Token generado exitosamente",
      "codigo": 0
    }
  ],
  "token": "jwt-token-here",
  "expiracion": "2023-12-19T11:30:00.000Z"
}
```

### 2. Recepción de Documentos

#### Recibir e-CF
```http
POST /api/facturaselectronicas
Authorization: Bearer jwt-token-here
Content-Type: multipart/form-data

file: [archivo.xml]
```

**Respuesta:**
```json
{
  "trackId": "uuid-here",
  "codigo": 1,
  "estado": "Aceptado",
  "rnc": "123456789",
  "encf": "E310000000001",
  "secuenciaUtilizada": true,
  "fechaRecepcion": "2023-12-19T10:30:00.000Z",
  "mensajes": [
    {
      "valor": "Documento recibido exitosamente",
      "codigo": 0
    }
  ]
}
```

#### Recibir FC (Factura de Consumo)
```http
POST /api/recepcion/ecf
Authorization: Bearer jwt-token-here
Content-Type: multipart/form-data

file: [archivo.xml]
```

### 3. Consultas

#### Consultar Estado por TrackId
```http
GET /api/consultas/estado?trackId=uuid-here
Authorization: Bearer jwt-token-here
```

#### Consultar Estado por RNC y eNCF
```http
GET /api/consultas/estado?rnc=123456789&encf=E310000000001
Authorization: Bearer jwt-token-here
```

#### Consultar TrackIds
```http
GET /api/trackids/consulta?rnc=123456789&fechaDesde=2023-12-01&fechaHasta=2023-12-31
Authorization: Bearer jwt-token-here
```

### 4. Aprobación Comercial

#### Enviar Aprobación Comercial
```http
POST /api/aprobacioncomercial
Authorization: Bearer jwt-token-here
Content-Type: multipart/form-data

file: [archivo.xml]
```

### 5. Anulación

#### Anular Rango de Secuencias
```http
POST /api/operaciones/anularrango
Authorization: Bearer jwt-token-here
Content-Type: application/json

{
  "rncEmisor": "123456789",
  "tipoECF": 31,
  "secuenciaDesde": "E310000000001",
  "secuenciaHasta": "E310000000010",
  "motivoAnulacion": "Error en la emisión"
}
```

### 6. Directorio de Contribuyentes

#### Listar Todos los Contribuyentes
```http
GET /api/consultas/listado
Authorization: Bearer jwt-token-here
```

#### Obtener Directorio por RNC
```http
GET /api/consultas/obtenerdirectorioporrnc?rnc=123456789
Authorization: Bearer jwt-token-here
```

### 7. Estatus de Servicios

#### Obtener Estatus de Servicios
```http
GET /api/estatusservicios/obtenerestatus
Authorization: Bearer jwt-token-here
```

#### Verificar Estado
```http
GET /api/estatusservicios/verificarestado
Authorization: Bearer jwt-token-here
```

## 🔐 Autenticación

### Flujo de Autenticación

1. **Obtener Semilla**: Solicitar semilla con RNC
2. **Firmar Semilla**: Firmar la semilla con certificado digital
3. **Validar Semilla**: Enviar semilla firmada para obtener token
4. **Usar Token**: Incluir token en header `Authorization: Bearer <token>`

### Certificados Digitales

- **Algoritmo**: SHA-256
- **Formato**: X.509
- **Validación**: Campo "SN" debe corresponder al RNC
- **Vencimiento**: Verificación automática

## 📊 Códigos de Respuesta

| Código | Estado | Descripción |
|--------|--------|-------------|
| 0 | No encontrado | Documento no existe |
| 1 | Aceptado | Procesado exitosamente |
| 2 | Rechazado | Error en validación |
| 3 | En proceso | Procesando |
| 4 | Aceptado condicional | Requiere acción adicional |

## ⚠️ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 1001 | Certificado digital inválido |
| 1002 | Token expirado |
| 1003 | Semilla inválida |
| 2001 | XML malformado |
| 2002 | XSD inválido |
| 2003 | Firma inválida |
| 3001 | RNC inactivo |
| 3002 | eNCF vencido |
| 3003 | Secuencia no autorizada |
| 3004 | Monto excedido |
| 4001 | Servicio no disponible |
| 4002 | Timeout |
| 4003 | Error interno |

## 🔧 Configuración

### Variables de Entorno

```bash
# Aplicación
NODE_ENV=production
PORT=3000

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=vipe_dgii

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1h

# DGII
DGII_ENVIRONMENT=pre-cert
DGII_PRE_CERT_URL=https://ecf.dgii.gov.do/testecf/
DGII_CERT_URL=https://ecf.dgii.gov.do/certecf/
DGII_PROD_URL=https://ecf.dgii.gov.do/ecf/

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cache
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600
```

## 🧪 Testing

### Ejecutar Pruebas

```bash
# Todas las pruebas
npm test

# Pruebas unitarias
npm run test:unit

# Pruebas de integración
npm run test:integration

# Pruebas E2E
npm run test:e2e

# Con cobertura
npm run test:coverage
```

### Casos de Prueba

- ✅ Autenticación exitosa
- ✅ Validación de certificados
- ✅ Recepción de documentos
- ✅ Consultas de estado
- ✅ Manejo de errores
- ✅ Rate limiting
- ✅ Validación XML/XSD

## 🚀 Despliegue

### Docker

```bash
# Construir imagen
docker build -t vipe-dgii-api .

# Ejecutar contenedor
docker run -p 3000:3000 vipe-dgii-api

# Con Docker Compose
docker-compose up -d
```

### Producción

```bash
# Instalar dependencias
npm ci --only=production

# Compilar TypeScript
npm run build

# Ejecutar migraciones
npm run migrate

# Iniciar aplicación
npm start
```

## 📈 Monitoreo

### Health Check

```http
GET /health
```

**Respuesta:**
```json
{
  "status": "OK",
  "timestamp": "2023-12-19T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

### Métricas

- Tiempo de respuesta promedio
- Número de solicitudes por minuto
- Errores por tipo
- Uso de memoria y CPU
- Conexiones de base de datos

## 🔒 Seguridad

### Medidas Implementadas

- **HTTPS**: Comunicación encriptada
- **JWT**: Tokens seguros con expiración
- **Rate Limiting**: Protección contra abuso
- **Validación**: Input sanitization
- **CORS**: Control de origen
- **Helmet**: Headers de seguridad
- **Logging**: Auditoría completa

### Certificados Digitales

- Validación de firma SHA-256
- Verificación de vencimiento
- Validación de RNC en certificado
- Almacenamiento seguro

## 📞 Soporte

Para soporte técnico o consultas sobre la API:

- **Email**: soporte@vipe-dgii.com
- **Documentación**: https://docs.vipe-dgii.com
- **Issues**: https://github.com/vipe-dgii/api/issues

---

**Última actualización**: Diciembre 2023
**Versión de la API**: 1.0.0
**Versión DGII**: 1.6 (Junio 2023)
