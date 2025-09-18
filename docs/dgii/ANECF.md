# Esquema XSD para Anulación de e-CF (ANECF)

## 📋 Resumen
Este documento detalla la estructura del archivo XML para la **Anulación de Rangos de e-CF**. Este proceso se utiliza para informar a la DGII que una o más secuencias de e-CF no serán utilizadas y deben ser invalidadas.

Esto es crucial para mantener la integridad de las secuencias y se usa en casos donde, por ejemplo, se generó un lote de comprobantes que finalmente no se entregaron al cliente.

---

## 🏗️ Estructura del XML
El XML se compone de dos secciones principales:

1.  **`Encabezado`**: Contiene la información general del emisor y un resumen de la cantidad de comprobantes a anular.
2.  **`DetalleAnulacion`**: Especifica los rangos de secuencias de e-CF que serán anulados.

---

## 📄 Campos Detallados

### 1. Encabezado (`Encabezado`)

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `Version` | Versión del esquema. Valor fijo: **1.0**. | `string` |
| `RncEmisor` | RNC de la empresa que solicita la anulación. | `string` (9 u 11 dígitos) |
| `CantidadeNCFAnulados` | Cantidad total de e-NCF que se están anulando en este envío. | `integer` (hasta 10 dígitos) |
| `FechaHoraAnulacioneNCF`| Timestamp de cuándo se procesó la anulación. | `string` (dd-MM-yyyy HH:mm:ss) |

### 2. Detalle de Anulación (`DetalleAnulacion`)
Esta sección puede contener hasta 10 bloques de `Anulacion`, permitiendo anular diferentes tipos de e-CF en un solo envío.

#### 2.1 Anulación (`Anulacion`)

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `NoLinea` | Número secuencial de la línea de anulación. | `integer` (1 a 10) |
| `TipoeCF` | El tipo de comprobante que se está anulando (31, 32, etc.). | `integer` (Enumeración) |
| `TablaRangoSecuenciasAnuladaseNCF` | Contenedor para los rangos de secuencias. | - |
| `CantidadeNCFAnulados` | Cantidad de e-NCF anulados para este `TipoeCF`. | `integer` (hasta 10 dígitos) |

#### 2.2 Secuencias (`Secuencias` dentro de `TablaRangoSecuenciasAnuladaseNCF`)
Define el rango exacto de e-NCF a anular. Se pueden incluir hasta 10,000 rangos por cada tipo de e-CF.

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `SecuenciaeNCFDesde` | El primer e-NCF del rango a anular. | `string` (13 caracteres) |
| `SecuenciaeNCFHasta` | El último e-NCF del rango a anular. | `string` (13 caracteres) |
