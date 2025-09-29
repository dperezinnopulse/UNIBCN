# Script simple para verificar la base de datos
Write-Host "Verificando base de datos..." -ForegroundColor Green

try {
    # Verificar Modalidad Gestión (ID=4)
    $query1 = "SELECT COUNT(*) as Total FROM ValoresDominio WHERE DominioId = 4"
    $result1 = Invoke-Sqlcmd -ServerInstance '192.168.8.157,1433' -Database 'UB_Formacion' -Username 'sa' -Password 'Inno.2025$' -Query $query1
    Write-Host "Modalidad Gestión (ID=4): $($result1.Total) valores" -ForegroundColor Yellow
    
    # Verificar nuevos dominios
    $query2 = "SELECT d.Nombre, COUNT(vd.Id) as Total FROM Dominios d LEFT JOIN ValoresDominio vd ON d.Id = vd.DominioId WHERE d.Nombre IN ('MODALIDAD_IMPARTICION', 'TIPOS_PARTICIPANTE_ROL') GROUP BY d.Nombre"
    $result2 = Invoke-Sqlcmd -ServerInstance '192.168.8.157,1433' -Database 'UB_Formacion' -Username 'sa' -Password 'Inno.2025$' -Query $query2
    Write-Host "Nuevos dominios:" -ForegroundColor Yellow
    $result2 | Format-Table Nombre, Total -AutoSize
    
    # Verificar Idioma (ID=14)
    $query3 = "SELECT COUNT(*) as Total FROM ValoresDominio WHERE DominioId = 14"
    $result3 = Invoke-Sqlcmd -ServerInstance '192.168.8.157,1433' -Database 'UB_Formacion' -Username 'sa' -Password 'Inno.2025$' -Query $query3
    Write-Host "Idioma (ID=14): $($result3.Total) valores" -ForegroundColor Yellow
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

