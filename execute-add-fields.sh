#!/bin/bash

# Script para ejecutar add_activity_fields_complete.sql
# Ejecuta el script SQL que agrega los campos nuevos a la tabla Actividades

echo "=== EJECUTANDO SCRIPT PARA AGREGAR CAMPOS NUEVOS ==="

# Verificar que el archivo SQL existe
SQL_FILE="add_activity_fields_complete.sql"
if [ ! -f "$SQL_FILE" ]; then
    echo "❌ ERROR: No se encontró el archivo $SQL_FILE"
    exit 1
fi

echo "✅ Archivo SQL encontrado: $SQL_FILE"

# Ejecutar el script SQL usando sqlcmd
echo "🔄 Ejecutando script SQL..."

# Intentar ejecutar con sqlcmd
if command -v sqlcmd &> /dev/null; then
    echo "📋 Usando sqlcmd..."
    sqlcmd -S localhost -E -i "$SQL_FILE" -o "add-fields-output.log"
    EXIT_CODE=$?
else
    echo "❌ sqlcmd no está disponible"
    echo "💡 Intentando con otras opciones..."
    
    # Intentar con otras herramientas de SQL
    if command -v psql &> /dev/null; then
        echo "📋 Usando psql..."
        psql -h localhost -U postgres -d UB_Formacion -f "$SQL_FILE" > "add-fields-output.log" 2>&1
        EXIT_CODE=$?
    else
        echo "❌ No se encontró ninguna herramienta de SQL disponible"
        echo "💡 Instale sqlcmd o psql para ejecutar el script"
        exit 1
    fi
fi

if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Script SQL ejecutado correctamente"
    echo "📄 Log guardado en: add-fields-output.log"
    
    # Mostrar las últimas líneas del log
    echo ""
    echo "=== ÚLTIMAS LÍNEAS DEL LOG ==="
    tail -20 "add-fields-output.log"
else
    echo "❌ ERROR al ejecutar el script SQL"
    echo "Código de salida: $EXIT_CODE"
    echo "📄 Revisar log en: add-fields-output.log"
    
    # Mostrar el log de error
    echo ""
    echo "=== LOG DE ERROR ==="
    cat "add-fields-output.log"
fi

echo ""
echo "=== SCRIPT COMPLETADO ==="
