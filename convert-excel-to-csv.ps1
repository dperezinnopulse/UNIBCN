# Script PowerShell para convertir Excel a CSV manteniendo caracteres especiales
# Soporta acentos, ñ, y otros caracteres del español y catalán

param(
    [string]$ExcelPath = "C:\Traspaso\DominiosUNIUB.xlsx",
    [string]$CsvPath = ""
)

Write-Host "Convertidor de Excel a CSV" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Green

# Verificar que el archivo Excel existe
if (!(Test-Path $ExcelPath)) {
    Write-Host "Error: El archivo $ExcelPath no existe" -ForegroundColor Red
    exit 1
}

# Si no se especifica ruta de salida, usar la misma carpeta con extensión .csv
if ($CsvPath -eq "") {
    $CsvPath = $ExcelPath -replace '\.xlsx?$', '.csv'
}

Write-Host "📖 Leyendo archivo Excel: $ExcelPath" -ForegroundColor Cyan

try {
    # Crear objeto Excel
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    
    # Abrir el archivo Excel
    $workbook = $excel.Workbooks.Open($ExcelPath)
    $worksheet = $workbook.Worksheets.Item(1)  # Primera hoja
    
    # Obtener el rango usado
    $usedRange = $worksheet.UsedRange
    $rowCount = $usedRange.Rows.Count
    $colCount = $usedRange.Columns.Count
    
    Write-Host "✅ Archivo leído correctamente" -ForegroundColor Green
    Write-Host "📊 Dimensiones: $rowCount filas x $colCount columnas" -ForegroundColor Yellow
    
    # Crear array para almacenar los datos
    $csvData = @()
    
    # Leer los datos fila por fila
    for ($row = 1; $row -le $rowCount; $row++) {
        $rowData = @()
        for ($col = 1; $col -le $colCount; $col++) {
            $cellValue = $worksheet.Cells.Item($row, $col).Text
            # Escapar comillas dobles y envolver en comillas si contiene comas
            if ($cellValue -match '[,;"]') {
                $cellValue = '"' + ($cellValue -replace '"', '""') + '"'
            }
            $rowData += $cellValue
        }
        $csvData += ($rowData -join ',')
    }
    
    # Mostrar las primeras filas para verificar
    Write-Host "`n🔍 Primeras 5 filas:" -ForegroundColor Cyan
    for ($i = 0; $i -lt [Math]::Min(5, $csvData.Count); $i++) {
        Write-Host $csvData[$i] -ForegroundColor White
    }
    
    # Guardar como CSV con codificación UTF-8
    Write-Host "`nGuardando como CSV: $CsvPath" -ForegroundColor Cyan
    
    # Crear el contenido CSV con BOM para UTF-8
    $csvContent = $csvData -join "`n"
    $utf8Bom = [System.Text.Encoding]::UTF8.GetPreamble()
    $utf8Bytes = [System.Text.Encoding]::UTF8.GetBytes($csvContent)
    $finalBytes = $utf8Bom + $utf8Bytes
    
    [System.IO.File]::WriteAllBytes($CsvPath, $finalBytes)
    
    Write-Host "✅ Conversión completada exitosamente" -ForegroundColor Green
    Write-Host "📁 Archivo CSV creado: $CsvPath" -ForegroundColor Green
    Write-Host "🔤 Codificación: UTF-8 con BOM (soporta acentos, ñ, etc.)" -ForegroundColor Yellow
    
    # Cerrar Excel
    $workbook.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    
} catch {
    Write-Host "❌ Error durante la conversión: $($_.Exception.Message)" -ForegroundColor Red
    
    # Asegurar que Excel se cierre
    if ($excel) {
        $excel.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    }
    exit 1
}

Write-Host "`n🎉 ¡Conversión exitosa!" -ForegroundColor Green
Write-Host "📄 Archivo CSV disponible en: $CsvPath" -ForegroundColor White
