# Script para verificar directamente en la base de datos si los cambios se aplicaron
Write-Host "=== VERIFICACIÓN DIRECTA EN BASE DE DATOS ===" -ForegroundColor Green

try {
    # Consulta SQL para verificar los dominios
    $query = @"
-- Verificar Modalidad Gestión (ID=4)
SELECT 'Modalidad Gestión (ID=4)' as Dominio, COUNT(*) as TotalValores
FROM ValoresDominio WHERE DominioId = 4

UNION ALL

-- Verificar nuevos dominios
SELECT d.Nombre as Dominio, COUNT(vd.Id) as TotalValores
FROM Dominios d
LEFT JOIN ValoresDominio vd ON d.Id = vd.DominioId
WHERE d.Nombre IN ('MODALIDAD_IMPARTICION', 'TIPOS_PARTICIPANTE_ROL')
GROUP BY d.Id, d.Nombre

UNION ALL

-- Verificar Idioma (ID=14)
SELECT 'Idioma (ID=14)' as Dominio, COUNT(*) as TotalValores
FROM ValoresDominio WHERE DominioId = 14
"@

    $result = Invoke-Sqlcmd -ServerInstance '192.168.8.157,1433' -Database 'UB_Formacion' -Username 'sa' -Password 'Inno.2025$' -Query $query
    
    Write-Host "`n📊 RESULTADOS DE LA VERIFICACIÓN:" -ForegroundColor Yellow
    $result | Format-Table Dominio, TotalValores -AutoSize
    
    # Verificar valores específicos
    Write-Host "`n🔍 VERIFICANDO VALORES ESPECÍFICOS:" -ForegroundColor Yellow
    
    # Modalidad Gestión
    $queryModalidad = "SELECT Valor, Descripcion FROM ValoresDominio WHERE DominioId = 4 ORDER BY Valor"
    $modalidad = Invoke-Sqlcmd -ServerInstance '192.168.8.157,1433' -Database 'UB_Formacion' -Username 'sa' -Password 'Inno.2025$' -Query $queryModalidad
    Write-Host "`nModalidad Gestión (ID=4):" -ForegroundColor Cyan
    $modalidad | Format-Table Valor, Descripcion -AutoSize
    
    # Modalidad Impartición
    $queryImparticion = @"
SELECT vd.Valor, vd.Descripcion 
FROM Dominios d
JOIN ValoresDominio vd ON d.Id = vd.DominioId
WHERE d.Nombre = 'MODALIDAD_IMPARTICION'
ORDER BY vd.Valor
"@
    $imparticion = Invoke-Sqlcmd -ServerInstance '192.168.8.157,1433' -Database 'UB_Formacion' -Username 'sa' -Password 'Inno.2025$' -Query $queryImparticion
    Write-Host "`nModalidad Impartición:" -ForegroundColor Cyan
    $imparticion | Format-Table Valor, Descripcion -AutoSize
    
    # Idioma
    $queryIdioma = "SELECT Valor, Descripcion FROM ValoresDominio WHERE DominioId = 14 ORDER BY Valor"
    $idioma = Invoke-Sqlcmd -ServerInstance '192.168.8.157,1433' -Database 'UB_Formacion' -Username 'sa' -Password 'Inno.2025$' -Query $queryIdioma
    Write-Host "`nIdioma (ID=14):" -ForegroundColor Cyan
    $idioma | Format-Table Valor, Descripcion -AutoSize
    
    # Tipos Participante Rol
    $queryParticipante = @"
SELECT vd.Valor, vd.Descripcion 
FROM Dominios d
JOIN ValoresDominio vd ON d.Id = vd.DominioId
WHERE d.Nombre = 'TIPOS_PARTICIPANTE_ROL'
ORDER BY vd.Valor
"@
    $participante = Invoke-Sqlcmd -ServerInstance '192.168.8.157,1433' -Database 'UB_Formacion' -Username 'sa' -Password 'Inno.2025$' -Query $queryParticipante
    Write-Host "`nTipos Participante Rol (primeros 10):" -ForegroundColor Cyan
    $participante | Select-Object -First 10 | Format-Table Valor, Descripcion -AutoSize
    
} catch {
    Write-Host "❌ Error consultando la base de datos: $($_.Exception.Message)" -ForegroundColor Red
}



