# Esquema XSD para Aprobación Comercial (ACECF)

## 📋 Resumen
Este documento detalla la estructura del archivo XML para la **Aprobación o Rechazo Comercial de un e-CF**. Este es el mecanismo que utiliza un comprador para notificar al emisor si acepta o rechaza un Comprobante Fiscal Electrónico que ha recibido.

Este proceso es fundamental para la gestión de cuentas por cobrar y por pagar, ya que formaliza el estado de una factura.

---

## 🏗️ Estructura del XML

El XML de Aprobación Comercial es un documento sencillo que contiene una única sección principal: `DetalleAprobacionComercial`.

### Campos Detallados (`DetalleAprobacionComercial`)

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `Version` | Versión del esquema. Valor fijo: **1.0**. | `string` |
| `RNCEmisor` | RNC de la empresa que emitió el e-CF original. | `string` (9 u 11 dígitos) |
| `eNCF` | El e-NCF del comprobante que se está aprobando o rechazando. | `string` (11 o 13 caracteres) |
| `FechaEmision` | Fecha de emisión del e-CF original. | `string` (dd-MM-yyyy) |
| `MontoTotal` | Monto total del e-CF original. | `decimal` (18,2) |
| `RNCComprador` | RNC de la empresa que realiza la aprobación/rechazo. | `string` (9 u 11 dígitos) |
| `Estado` | **(Clave)** Indica si el comprobante es aceptado o rechazado. | `integer` (1: Aceptado, 2: Rechazado) |
| `DetalleMotivoRechazo` | (Opcional) Descripción del motivo en caso de rechazo. | `string` (hasta 250 caracteres) |
| `FechaHoraAprobacionComercial` | Timestamp de cuándo se procesó la aprobación o rechazo. | `string` (dd-MM-yyyy HH:mm:ss) |
