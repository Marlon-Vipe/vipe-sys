# Esquema XSD para Nota de Crédito (e-CF 34)

## 📋 Resumen
Este documento detalla la estructura del archivo XML para una **Nota de Crédito Electrónica (e-CF 34)**. Este tipo de comprobante se utiliza para modificar o anular una factura (u otro comprobante) emitida previamente. Las razones comunes incluyen devoluciones de mercancía, aplicación de descuentos posteriores a la facturación o corrección de errores.

La característica principal de este comprobante es que **debe hacer referencia a un e-CF emitido anteriormente**.

---

## 🏗️ Estructura General del XML
La estructura es similar a otros e-CF, pero con una sección clave de referencia:

1.  **`Encabezado`**: Información general del emisor, comprador y totales del ajuste.
2.  **`DetallesItems`**: El detalle de los productos o servicios que se están ajustando.
3.  **`InformacionReferencia`**: **(Obligatorio)** Contiene los datos del comprobante que está siendo modificado.
4.  **`FechaHoraFirma`**: Timestamp de la firma digital.

---

## 📄 Campos Detallados

### 1. Encabezado (`Encabezado`)

#### 1.1 Identificación del Documento (`IdDoc`)
Datos únicos de la nota de crédito.

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `TipoeCF` | Tipo de e-CF. Para este caso, siempre será **34**. | `xs:integer` (Enumeración) |
| `eNCF` | Secuencia del Número de Comprobante Fiscal de la nota de crédito. | `string` (13 caracteres) |
| `IndicadorNotaCredito` | Indica si la nota de crédito se emite antes o después de 30 días de la factura original. | `integer` (0 o 1) |

#### 1.2 Emisor y Comprador
Las secciones `Emisor` y `Comprador` son idénticas a las de la factura original a la que se hace referencia.

---

### 2. Información de Referencia (`InformacionReferencia`)
Esta es la sección más importante de una Nota de Crédito.

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `NCFModificado` | **(Obligatorio)** El e-NCF de la factura que se está corrigiendo o anulando. | `string` (11 a 19 caracteres) |
| `FechaNCFModificado` | **(Obligatorio)** La fecha de emisión de la factura que se está modificando. | `string` (dd-MM-yyyy) |
| `CodigoModificacion` | **(Obligatorio)** Código que indica la razón del ajuste. | `integer` (Enumeración) |
| `RazonModificacion` | (Opcional) Descripción textual del motivo de la modificación. | `string` (hasta 90 caracteres) |

**Códigos de Modificación (`CodigoModificacion`):**
- **1**: Anulación total del NCF modificado.
- **2**: Corrección de texto.
- **3**: Corrección de montos.
- **4**: Reemplazo de NCF emitido en contingencia.
- **5**: Referencia a Factura de Consumo Electrónica.

---

### 3. Totales y Detalles de Items
Las secciones `Totales` y `DetallesItems` funcionan de manera similar a una factura, pero los montos representan los valores que se están acreditando (restando) al comprobante original.
