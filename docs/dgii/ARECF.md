# Esquema XSD para Acuse de Recibo (ARECF)

## 📋 Resumen
Este documento detalla la estructura del archivo XML para el **Acuse de Recibo de un e-CF**. Este es un mensaje que el receptor de un comprobante envía a la DGII para notificar que ha recibido el documento electrónico.

Este paso es un prerrequisito antes de poder enviar la "Aprobación Comercial" y es parte del ciclo de vida obligatorio de un e-CF.

---

## 🏗️ Estructura del XML
El XML es un documento simple con una única sección principal: `DetalleAcusedeRecibo`.

### Campos Detallados (`DetalleAcusedeRecibo`)

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `Version` | Versión del esquema. Valor fijo: **1.0**. | `decimal` |
| `RNCEmisor` | RNC de la empresa que emitió el e-CF. | `string` (9 u 11 dígitos) |
| `RNCComprador` | RNC de la empresa que recibió el e-CF. | `string` (9 u 11 dígitos) |
| `eNCF` | El e-NCF del comprobante que se está confirmando. | `string` (9, 11 o 13 caracteres) |
| `Estado` | Indica si el comprobante fue recibido o no. | `integer` (0: Recibido, 1: No Recibido) |
| `CodigoMotivoNoRecibido` | (Opcional) Código que indica la razón por la que no se recibió. | `integer` (Enumeración) |
| `FechaHoraAcuseRecibo` | Timestamp de cuándo se procesó el acuse de recibo. | `string` (dd-MM-yyyy HH:mm:ss) |

**Códigos de Motivo No Recibido:**
- **1**: Error de Especificación.
- **2**: Error de Firma Digital.
- **3**: Envío Duplicado.
- **4**: RNC Comprador no Corresponde.
