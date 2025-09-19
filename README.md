# API de Facturación Electrónica DGII (vipe-dgii)

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

API completa para la **Facturación Electrónica** según la normativa de la DGII de República Dominicana versión 1.6 (Junio 2023). Implementa todos los servicios requeridos para el cumplimiento fiscal electrónico.

## 🚀 Características Principales

- ✅ **Autenticación con Certificados Digitales** - Semilla y validación JWT
- ✅ **Recepción de e-CF** - Comprobantes fiscales electrónicos
- ✅ **Recepción de FC** - Facturas de consumo < RD$250,000
- ✅ **Consultas de Estado** - TrackId, RNC, eNCF
- ✅ **Aprobación Comercial** - ACECF y ARECF
- ✅ **Anulación de Secuencias** - ANECF
- ✅ **Directorio de Contribuyentes** - Consultas y listados
- ✅ **Validación XML/XSD** - Cumplimiento estricto
- ✅ **Rate Limiting** - Protección contra abuso
- ✅ **Logging Completo** - Auditoría fiscal
- ✅ **Docker Support** - Despliegue containerizado

## 🏗️ Arquitectura

### Stack Tecnológico
- **Backend**: Node.js + TypeScript + Express.js
- **Base de Datos**: PostgreSQL
- **Cache**: Redis
- **Autenticación**: JWT + Certificados Digitales SHA-256
- **Validación**: class-validator + XSD
- **Testing**: Jest + Supertest
- **Containerización**: Docker + Docker Compose

### Principios de Diseño
- **Clean Architecture** - Separación clara de responsabilidades
- **Domain-Driven Design** - Modelado basado en el dominio fiscal
- **SOLID Principles** - Código mantenible y extensible
- **Security First** - Cumplimiento de auditorías DGII

## 📋 Servicios Implementados

### 1. Autenticación
- `GET /api/autenticacion/semilla` - Obtener semilla
- `POST /api/autenticacion/validarsemilla` - Validar semilla firmada

### 2. Recepción de Documentos
- `POST /api/facturaselectronicas` - Recibir e-CF
- `POST /api/recepcion/ecf` - Recibir FC

### 3. Consultas
- `GET /api/consultas/estado` - Consultar estado
- `GET /api/trackids/consulta` - Consultar TrackIds
- `GET /api/consultas/listado` - Listar contribuyentes

### 4. Aprobación y Anulación
- `POST /api/aprobacioncomercial` - Aprobación comercial
- `POST /api/operaciones/anularrango` - Anular secuencias

### 5. Estatus de Servicios
- `GET /api/estatusservicios/obtenerestatus` - Estatus de servicios

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- PostgreSQL 15+
- Redis (opcional)
- Docker (opcional)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/vipe-dgii/api.git
cd vipe-dgii

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
# Editar .env con tus configuraciones

# Ejecutar migraciones
npm run migrate

# Iniciar en desarrollo
npm run dev

# Iniciar en producción
npm run build
npm start
```

### Con Docker

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Detener servicios
docker-compose down
```

## 🔧 Configuración

### Variables de Entorno

```bash
# Aplicación
NODE_ENV=development
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
```

## 📚 Documentación

### API Documentation
- [**Documentación Completa de la API**](./docs/api/API_DOCUMENTATION.md)

### Guías Técnicas
- [**Guía del Proyecto**](./docs/PROJECT_GUIDELINES.md)
- [**Especificaciones DGII**](./docs/dgii/)

### Ambientes DGII
- **Pre-Certificación**: `https://ecf.dgii.gov.do/testecf/`
- **Certificación**: `https://ecf.dgii.gov.do/certecf/`
- **Producción**: `https://ecf.dgii.gov.do/ecf/`

## 🧪 Testing

```bash
# Ejecutar todas las pruebas
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

## 📊 Monitoreo

### Health Check
```bash
curl http://localhost:3000/health
```

### Métricas Disponibles
- Tiempo de respuesta promedio
- Número de solicitudes por minuto
- Errores por tipo
- Uso de memoria y CPU
- Conexiones de base de datos

## 🔒 Seguridad

### Medidas Implementadas
- **HTTPS** - Comunicación encriptada
- **JWT** - Tokens seguros con expiración
- **Rate Limiting** - Protección contra abuso
- **Validación** - Input sanitization
- **CORS** - Control de origen
- **Helmet** - Headers de seguridad
- **Logging** - Auditoría completa

### Certificados Digitales
- Validación de firma SHA-256
- Verificación de vencimiento
- Validación de RNC en certificado
- Almacenamiento seguro

## 🚀 Despliegue

### Producción con Docker
```bash
# Construir imagen
docker build -t vipe-dgii-api .

# Ejecutar con variables de entorno
docker run -p 3000:3000 \
  -e DB_HOST=your-db-host \
  -e JWT_SECRET=your-secret \
  vipe-dgii-api
```

### Producción Tradicional
```bash
# Instalar dependencias de producción
npm ci --only=production

# Compilar TypeScript
npm run build

# Ejecutar migraciones
npm run migrate

# Iniciar aplicación
npm start
```

## 📈 Roadmap

- [ ] Implementación completa de validación XSD
- [ ] Integración con servicios DGII reales
- [ ] Dashboard de monitoreo
- [ ] API de métricas avanzadas
- [ ] Soporte para múltiples ambientes
- [ ] Cache inteligente con Redis
- [ ] Notificaciones en tiempo real

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

- **Email**: soporte@vipe-dgii.com
- **Documentación**: https://docs.vipe-dgii.com
- **Issues**: https://github.com/vipe-dgii/api/issues

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- DGII República Dominicana por la documentación técnica
- Comunidad de desarrolladores de Node.js
- Contribuidores del proyecto

---

**Última actualización**: Diciembre 2023  
**Versión de la API**: 1.0.0  
**Versión DGII**: 1.6 (Junio 2023)