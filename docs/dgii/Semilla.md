# Esquema XSD para Semilla de Autenticación

## 📋 Resumen
Este documento detalla la estructura del XML de la **Semilla**, que es el primer paso en el proceso de autenticación con los servicios web de la DGII.

Para realizar cualquier operación (enviar facturas, solicitar anulaciones, etc.), primero se debe solicitar una "semilla" a la DGII. Esta semilla se utiliza luego para generar la firma digital de los documentos XML que se enviarán.

---

## 🏗️ Estructura del XML
El XML de la semilla es muy simple y contiene los dos campos necesarios para la autenticación.

### Campos Detallados (`SemillaModel`)

| Campo | Descripción | Tipo / Validación |
| :--- | :--- | :--- |
| `valor` | El valor de la semilla en sí. Es un string largo que funciona como un token de un solo uso. | `xs:string` |
| `fecha` | La fecha y hora en que la semilla fue generada por la DGII. | `xs:dateTime` |
