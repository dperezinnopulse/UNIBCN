# Script para analizar correspondencia entre dominios CSV y BD
Write-Host "Analizando dominios existentes en la base de datos..." -ForegroundColor Green

try {
    # Consultar dominios existentes
    $dominiosBD = Invoke-Sqlcmd -ServerInstance "192.168.8.157,1433" -Database "UB_Formacion" -Username "sa" -Password "Inno.2025$" -Query "SELECT Id, Nombre FROM Dominios ORDER BY Nombre"
    
    Write-Host "`n=== DOMINIOS EXISTENTES EN LA BASE DE DATOS ===" -ForegroundColor Yellow
    $dominiosBD | Format-Table -AutoSize
    
    # Dominios del CSV
    $dominiosCSV = @(
        "SubUnidadgGestora-T01",
        "Lineaestrategica-T02", 
        "ObjetivoEstrategico-T03",
        "ActividadReservada-T04",
        "CoordinadorIDP-T05",
        "JefeUnidad-T06",
        "FacultadDestinataria-T07",
        "ModalidadImparticion-T11",
        "ModalidadGestion-T15",
        "TiposParticipanteRol-T17",
        "TipoActividad-T18"
    )
    
    Write-Host "`n=== ANÁLISIS DE CORRESPONDENCIA ===" -ForegroundColor Yellow
    
    # Mapeo manual basado en el análisis
    $correspondencias = @{
        "SubUnidadgGestora-T01" = "NUEVO - Crear nuevo dominio"
        "Lineaestrategica-T02" = "LINEAS_ESTRATEGICAS"
        "ObjetivoEstrategico-T03" = "OBJETIVOS_ESTRATEGICOS"
        "ActividadReservada-T04" = "ACTIVIDAD_RESERVADA"
        "CoordinadorIDP-T05" = "COORDINADOR_IDP"
        "JefeUnidad-T06" = "JEFE_UNIDAD"
        "FacultadDestinataria-T07" = "FACULTAD_DESTINATARIA"
        "ModalidadImparticion-T11" = "MODALIDAD_IMPARTICION"
        "ModalidadGestion-T15" = "MODALIDAD_GESTION"
        "TiposParticipanteRol-T17" = "TIPOS_PARTICIPANTE_ROL"
        "TipoActividad-T18" = "TIPO_ACTIVIDAD"
    }
    
    foreach ($dominioCSV in $dominiosCSV) {
        $correspondencia = $correspondencias[$dominioCSV]
        $encontrado = $dominiosBD | Where-Object { $_.Nombre -eq $correspondencia }
        
        if ($correspondencia -eq "NUEVO - Crear nuevo dominio") {
            Write-Host "✅ $dominioCSV -> $correspondencia" -ForegroundColor Green
        } elseif ($encontrado) {
            Write-Host "✅ $dominioCSV -> $correspondencia (ID: $($encontrado.Id))" -ForegroundColor Green
        } else {
            Write-Host "❌ $dominioCSV -> $correspondencia (NO ENCONTRADO)" -ForegroundColor Red
        }
    }
    
    Write-Host "`n=== RESUMEN ===" -ForegroundColor Yellow
    Write-Host "Total dominios en CSV: $($dominiosCSV.Count)"
    Write-Host "Dominios nuevos a crear: 1 (SubUnidadgGestora-T01)"
    Write-Host "Dominios a actualizar: $($dominiosCSV.Count - 1)"
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
