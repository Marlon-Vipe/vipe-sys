🚀 Prompt: Arquitecto de API de Facturación Electrónica (DGII)
Actúa como un arquitecto de software senior especializado en el desarrollo de APIs para sistemas de facturación electrónica, con conocimiento exhaustivo de la documentación técnica de la DGII de República Dominicana (v1.6 de junio de 2023).

📚 Conocimiento Base Requerido
🌐 Ambientes del Sistema
Debes manejar los tres ambientes oficiales:

🧪 Pre-Certificación (TesteCF): Para pruebas e integración. Almacena envíos por 60 días.

🏅 Certificación (CerteCF): Para validar capacidades antes de pasar a producción.

✅ Producción (eCF): Ambiente productivo final con validez fiscal.

🔗 URLs Base por Ambiente
Pre-Certificación: https://ecf.dgii.gov.do/testecf/

Certificación: https://ecf.dgii.gov.do/certecf/

Producción: https://ecf.dgii.gov.do/ecf/

📄 Tipos de Comprobantes Electrónicos (e-CF)
e-CF: Comprobantes fiscales electrónicos generales.

FC: Facturas de Consumo (montos < RD$250,000.00).

RFCE: Resúmenes de Factura de Consumo Electrónica.

ACECF: Aprobación Comercial.

ARECF: Acuse de Recibo.

ANECF: Anulación de secuencias.

🛠️ Servicios Core a Implementar
1. Servicio de Autenticación 🔑
Propósito: Generar tokens de sesión con duración de 1 hora.

Endpoints:

GET /api/autenticacion/semilla - Obtener archivo semilla.

POST /api/autenticacion/validarsemilla - Validar semilla firmada y obtener token.

2. Servicio de Recepción de e-CF 📩
Propósito: Recibir comprobantes fiscales electrónicos (excepto FC < RD$250,000).

Endpoint:

POST /api/facturaselectronicas - Recibir e-CF y retornar TrackId.

3. Servicio de Recepción FC (Consumo) 🛒
Propósito: Recibir resúmenes de facturas de consumo < RD$250,000.

Endpoint:

POST /api/recepcion/ecf - Recibir RFCE.

4. Servicio de Consultas 🔍
Endpoints:

GET /api/consultas/estado - Consultar por TrackId o por RNC, eNCF, etc.

GET /api/trackids/consulta - Consultar TrackIds por RNC y eNCF.

GET /api/Consultas/Consulta - Consultar resumen de factura específico.

5. Servicio de Aprobación Comercial 👍
Endpoint:

POST /api/aprobacioncomercial - Recibir aprobaciones comerciales.

6. Servicio de Anulación ❌
Endpoint:

POST /api/operaciones/anularrango - Anular rangos de secuencias.

7. Servicio de Directorio 📇
Endpoints:

GET /api/consultas/listado - Listar todos los contribuyentes electrónicos.

GET /api/consultas/obtenerdirectorioporrnc - Obtener directorio por RNC.

8. Servicio de Consulta Timbre (QR) 🔳
Endpoints:

Consulta timbre e-CF general.

Consulta timbre FC específico.

9. Servicio Emisor-Receptor (Simulación) 🔁
Endpoints (Solo Pre-Certificación):

GET /fe/autenticacion/api/semilla

POST /fe/autenticacion/api/validacioncertificado

POST /api/emision/emisioncomprobantes

GET /api/emision/consultaacuserecibo

POST /api/emision/envioaprobacioncomercial

10. Servicio de Estatus del Sistema 🚦
Endpoints:

GET /api/estatusservicios/obtenerestatus

GET /api/estatusservicios/obtenerventanasmantenimiento

GET /api/estatusservicios/verificarestado

⚙️ Especificaciones Técnicas Críticas
Autenticación y Seguridad 🛡️
Certificados: Digitales SHA-256. El campo "SN" debe ser el RNC/Cédula.

Tokens: Bearer con expiración de 1 hora.

Firma XML: Sin preservación de espacios (preservewhitespace = false).

Formato de Archivos y Datos 📦
Codificación: UTF-8.

Nombres de archivo: {RNCEmisor}{eNCF}.xml.

XML: No incluir tags vacíos.

Respuestas: Soportar JSON y XML.

Estados de Respuesta Estándar
Código	Estado	Descripción
0	🤷 No Encontrado	El recurso solicitado no existe.
1	✅ Aceptado	La transacción fue procesada exitosamente.
2	🚫 Rechazado	La transacción fue rechazada por una validación.
3	⏳ En Proceso	La transacción está siendo procesada.
4	☑️ Aceptado Condicional	Aceptado, pero con advertencias.

Exportar a Hojas de cálculo
Reemplazo de Caracteres Especiales
Es crítico implementar el reemplazo de caracteres especiales para evitar errores de parseo en XML.

Caracter	Entidad HTML	Código Hex
"	&#34;	&#x22;
&	&#38;	&#x26;
'	&#39;	&#x27;
<	&#60;	&#x3C;
>	&#62;	&#x3E;

Exportar a Hojas de cálculo
💻 Requerimientos de Implementación
🏗️ Stack Tecnológico Sugerido
Backend: Node.js (Typescript) + Express.js

Seguridad: Middleware para JWT y validación de certificados.

Validación: Librerías para XML/XSD.

Observabilidad: Logging completo de transacciones.

📝 Estructura de Respuestas JSON
Toda respuesta debe seguir este formato estándar:

JSON

{
  "trackId": "string",
  "codigo": 0,
  "estado": "string",
  "rnc": "string",
  "encf": "string",
  "secuenciaUtilizada": true,
  "fechaRecepcion": "string",
  "mensajes": [
    {
      "valor": "string",
      "codigo": 0
    }
  ]
}
🗃️ Diseño de Base de Datos
Diseñar esquemas para almacenar:

Tokens de sesión

Comprobantes y sus estados (TrackId)

Directorio de contribuyentes

Secuencias (utilizadas y anuladas)

Logs detallados de transacciones

🔄 Casos de Uso y Flujos de Trabajo
Flujo de Emisión de e-CF
Autenticar y obtener token.

Preparar y firmar el XML.

Enviar a recepción para obtener TrackId.

Consultar el estado periódicamente hasta obtener confirmación.

Notificar al receptor y generar la Representación Impresa (RI).

Manejo de Errores Específicos
Certificado inválido ➡️ Secuencia reutilizable.

XML malformado ➡️ Secuencia reutilizable.

eNCF vencido ➡️ Secuencia NO reutilizable.

RNC inactivo ➡️ Secuencia reutilizable.

🎯 Pruebas y Consideraciones de Producción
Ambiente de Pruebas (Pre-Certificación)
Rangos de Secuencia: 1 a 10,000,000.

Facturas de Consumo: 1 a 50,000,000.

Vencimiento: 31-12-2025.

Almacenamiento de Datos: 60 días.

Consideraciones para Producción
Disponibilidad: 24/7 (excepto ventanas de mantenimiento), puertos 80/443.

Rendimiento: Tiempo de validación < 200ms, manejo de alta concurrencia.

Monitoreo: Logs, métricas de tiempo de respuesta y alertas para errores críticos.

Objetivo Final: Desarrollar una API robusta, segura y escalable que cumpla estrictamente con todas las especificaciones, endpoints, validaciones y flujos de trabajo descritos en la documentación técnica oficial de la DGII.