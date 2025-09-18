# Esquema XSD para Nota de Débito (e-CF 33)

## 📋 Resumen
Este documento detalla la estructura del archivo XML para una **Nota de Débito Electrónica (e-CF 33)**. Este comprobante se utiliza para aumentar el valor de una factura (u otro comprobante) emitida previamente.

Al igual que la Nota de Crédito, **debe hacer referencia a un e-CF emitido anteriormente**.

---

## 🏗️ Estructura General del XML
La estructura es casi idéntica a la de la Nota de Crédito (e-CF 34).

1.  **`Encabezado`**: Información general del emisor, comprador y totales del ajuste.
2.  **`DetallesItems`**: El detalle de los conceptos que aumentan el valor.
3.  **`InformacionReferencia`**: **(Obligatorio)** Contiene los datos del comprobante que está siendo modificado.
4.  **`FechaHoraFirma`**: Timestamp de la firma digital.

---

## 📄 Campos Detallados

### 1. Identificación del Documento (`IdDoc`)

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `TipoeCF` | Tipo de e-CF. Para este caso, siempre será **33**. | `xs:integer` (Enumeración) |
| `eNCF` | Secuencia del Número de Comprobante Fiscal de la nota de débito. | `string` (13 caracteres) |

### 2. Información de Referencia (`InformacionReferencia`)
Esta sección es obligatoria y vincula la nota de débito con la factura original.

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `NCFModificado` | **(Obligatorio)** El e-NCF de la factura que se está aumentando de valor. | `string` (11 a 19 caracteres) |
| `FechaNCFModificado` | **(Obligatorio)** La fecha de emisión de la factura que se modifica. | `string` (dd-MM-yyyy) |
| `CodigoModificacion` | **(Obligatorio)** Código que indica la razón del ajuste (ej: corrección de montos). | `integer` (Enumeración) |
| `RazonModificacion` | (Opcional) Descripción textual del motivo del débito. | `string` (hasta 90 caracteres) |

### 3. Totales y Detalles de Items
Las secciones `Totales` y `DetallesItems` representan los valores que se están **sumando** al comprobante original.
