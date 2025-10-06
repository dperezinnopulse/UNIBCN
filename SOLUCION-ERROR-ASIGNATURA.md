# Solución Error FK_Actividades_Asignatura

## 🔍 Error identificado
**Error SQL**: `FK_Actividades_Asignatura` - Conflicto de clave foránea
- **Tabla**: `ValoresDominio` 
- **Columna**: `Id`
- **Problema**: El frontend enviaba `asignaturaId = 53` pero la BD tiene IDs desde 378 hasta 429

## 📊 Análisis del problema
1. **Frontend enviaba**: `asignaturaId = 53` (del log: `⏱️ select:options 'asignaturaId' = 53`)
2. **Base de datos tiene**: IDs de asignatura desde 378 hasta 429
3. **Causa raíz**: El campo `asignaturaId` NO estaba en la lista `camposQueUsanId` en `scripts-clean.js`

## ✅ Solución aplicada
**Archivo**: `wwwroot/scripts-clean.js`
**Línea**: 2205

**Antes**:
```javascript
const camposQueUsanId = ['remesa', 'unidadGestoraDetalle'];
```

**Después**:
```javascript
const camposQueUsanId = ['remesa', 'unidadGestoraDetalle', 'asignaturaId', 'disciplinaRelacionadaId', 'idiomaImparticionId', 'tiposCertificacionId', 'materiaDisciplinaId', 'ambitoFormacionId', 'tiposFinanciacionId', 'tiposInscripcionId', 'denominacionDescuentoIds'];
```

## 🎯 Resultado
- Los campos que requieren ID ahora usan `valor.id` en lugar de `valor.valor`
- Se evita el error de clave foránea al crear actividades
- La integridad referencial se mantiene correctamente

## 📅 Fecha de corrección
6 de octubre de 2025
