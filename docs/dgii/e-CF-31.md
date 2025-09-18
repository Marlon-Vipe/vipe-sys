# Esquema XSD para Factura de Crédito Fiscal (e-CF 31)

## 📋 Resumen
Este documento detalla la estructura del archivo XML para una **Factura de Crédito Fiscal Electrónica (e-CF 31)**, según la normativa de la DGII. Este tipo de comprobante se utiliza para registrar ventas a crédito entre contribuyentes y sustentar costos, gastos y crédito fiscal del ITBIS.

---

## 🏗️ Estructura General del XML
El XML se compone de las siguientes secciones principales:

1.  **`Encabezado`**: Contiene toda la información general de la factura, incluyendo datos del emisor, comprador, totales y el identificador del documento (eNCF).
2.  **`DetallesItems`**: Lista de todos los productos o servicios incluidos en la factura, con sus precios, impuestos y cantidades.
3.  **`InformacionReferencia`**: (Opcional) Usado en notas de crédito/débito para hacer referencia a un e-CF previamente emitido.
4.  **`FechaHoraFirma`**: Timestamp de la firma digital del documento.

---

## 📄 Campos Detallados

### 1. Encabezado (`Encabezado`)

#### 1.1 Identificación del Documento (`IdDoc`)
Contiene los datos únicos del comprobante.

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `TipoeCF` | Tipo de e-CF. Para este caso, siempre será **31**. | `xs:integer` (Enumeración) |
| `eNCF` | Secuencia del Número de Comprobante Fiscal Electrónico. | `string` (13 caracteres) |
| `FechaVencimientoSecuencia` | Fecha límite para el uso de la secuencia de eNCF. | `string` (dd-MM-yyyy) |
| `TipoPago` | Indica si el pago es de contado, a crédito, etc. | `xs:integer` (1: Contado, 2: Crédito) |
| `FechaLimitePago` | Fecha límite para saldar la factura (si es a crédito). | `string` (dd-MM-yyyy) |

#### 1.2 Emisor (`Emisor`)
Información de la empresa que emite la factura.

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `RNCEmisor` | RNC del contribuyente que emite. | `string` (9 u 11 dígitos) |
| `RazonSocialEmisor` | Nombre o razón social del emisor. | `string` (hasta 150 caracteres) |
| `DireccionEmisor` | Domicilio fiscal del emisor. | `string` (hasta 100 caracteres) |
| `FechaEmision` | Fecha en que se emite el comprobante. | `string` (dd-MM-yyyy) |

#### 1.3 Comprador (`Comprador`)
Información de la empresa o persona que recibe la factura.

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `RNCComprador` | RNC del contribuyente que compra. | `string` (9 u 11 dígitos) |
| `RazonSocialComprador`| Nombre o razón social del comprador. | `string` (hasta 150 caracteres) |

#### 1.4 Totales (`Totales`)
Resume los montos totales de la factura.

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `MontoGravadoTotal` | Suma total de los montos gravados con ITBIS. | `decimal` (18,2) |
| `MontoExento` | Suma total de los montos exentos de ITBIS. | `decimal` (18,2) |
| `TotalITBIS` | Suma total del ITBIS facturado. | `decimal` (18,2) |
| `MontoTotal` | Monto total de la factura (gravado + exento + ITBIS). | `decimal` (18,2) |
| `TotalITBISRetenido` | Monto total del ITBIS retenido por el comprador. | `decimal` (18,2) |
| `TotalISRRetencion` | Monto total de la retención de Impuesto Sobre la Renta. | `decimal` (18,2) |

---

### 2. Detalle de Items (`DetallesItems`)
Sección que contiene una o más líneas de `Item`.

#### 2.1 Item (`Item`)
Cada producto o servicio facturado.

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `NumeroLinea` | Número secuencial de la línea dentro de la factura. | `integer` (1 a 1000) |
| `IndicadorFacturacion`| Indica si el item es gravado, exento o no facturable. | `integer` (Enumeración) |
| `NombreItem` | Nombre del producto o servicio. | `string` (hasta 80 caracteres) |
| `CantidadItem` | Unidades del producto o servicio. | `decimal` (18,2) |
| `PrecioUnitarioItem` | Precio por unidad del producto o servicio. | `decimal` (20,4) |
| `MontoItem` | Monto total de la línea (Cantidad * Precio Unitario). | `decimal` (18,2) |
