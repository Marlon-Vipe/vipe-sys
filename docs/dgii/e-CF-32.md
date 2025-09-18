# Esquema XSD para Factura de Consumo (e-CF 32)

## 📋 Resumen
Este documento detalla la estructura del archivo XML para una **Factura de Consumo Electrónica (e-CF 32)**. Este tipo de comprobante se emite a consumidores finales, es decir, a personas que no utilizarán el bien o servicio para fines tributarios.

A diferencia de la Factura de Crédito Fiscal, en este comprobante los datos del comprador (RNC/Cédula) son opcionales.

---

## 🏗️ Estructura General del XML
La estructura es muy similar a la del e-CF 31 y se compone de:

1.  **`Encabezado`**: Información general de la factura (emisor, comprador, totales, eNCF).
2.  **`DetallesItems`**: Lista de productos o servicios.
3.  **`InformacionReferencia`**: (Opcional) Para notas de débito/crédito.
4.  **`FechaHoraFirma`**: Timestamp de la firma digital.

---

## 📄 Campos Detallados

### 1. Encabezado (`Encabezado`)

#### 1.1 Identificación del Documento (`IdDoc`)
Datos únicos del comprobante de consumo.

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `TipoeCF` | Tipo de e-CF. Para este caso, siempre será **32**. | `xs:integer` (Enumeración) |
| `eNCF` | Secuencia del Número de Comprobante Fiscal Electrónico. | `string` (13 caracteres) |
| `TipoPago` | Indica si el pago es de contado, a crédito, etc. | `xs:integer` (1: Contado, 2: Crédito) |

#### 1.2 Emisor (`Emisor`)
Información de la empresa que emite la factura (idéntica al e-CF 31).

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `RNCEmisor` | RNC del contribuyente que emite. | `string` (9 u 11 dígitos) |
| `RazonSocialEmisor` | Nombre o razón social del emisor. | `string` (hasta 150 caracteres) |
| `FechaEmision` | Fecha en que se emite el comprobante. | `string` (dd-MM-yyyy) |

#### 1.3 Comprador (`Comprador`)
Información del consumidor final. **La mayoría de los campos son opcionales.**

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `RNCComprador` | (Opcional) RNC o Cédula del comprador. | `string` (9 u 11 dígitos) |
| `IdentificadorExtranjero`| (Opcional) ID para comprador extranjero. | `string` (hasta 20 caracteres) |
| `RazonSocialComprador`| (Opcional) Nombre del comprador. | `string` (hasta 150 caracteres) |

#### 1.4 Totales (`Totales`)
Resume los montos totales. No incluye retenciones.

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `MontoGravadoTotal` | Suma total de los montos gravados con ITBIS. | `decimal` (18,2) |
| `MontoExento` | Suma total de los montos exentos de ITBIS. | `decimal` (18,2) |
| `TotalITBIS` | Suma total del ITBIS facturado. | `decimal` (18,2) |
| `MontoTotal` | Monto total de la factura. | `decimal` (18,2) |

---

### 2. Detalle de Items (`DetallesItems`)
La estructura de cada `Item` es prácticamente idéntica a la de la Factura de Crédito Fiscal (e-CF 31), detallando cada producto o servicio.
