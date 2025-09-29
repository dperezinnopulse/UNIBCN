# Script para verificar los valores específicos
Write-Host "Verificando valores específicos..." -ForegroundColor Green

try {
    # Verificar Tipos Participante Rol
    Write-Host "`nTipos Participante Rol:" -ForegroundColor Yellow
    $query1 = "SELECT vd.Valor, vd.Descripcion FROM Dominios d JOIN ValoresDominio vd ON d.Id = vd.DominioId WHERE d.Nombre = 'TIPOS_PARTICIPANTE_ROL' ORDER BY vd.Valor"
    $result1 = Invoke-Sqlcmd -ServerInstance '192.168.8.157,1433' -Database 'UB_Formacion' -Username 'sa' -Password 'Inno.2025$' -Query $query1
    $result1 | Format-Table Valor, Descripcion -AutoSize
    
    # Verificar Idioma
    Write-Host "`nIdioma (ID=14):" -ForegroundColor Yellow
    $query2 = "SELECT Valor, Descripcion FROM ValoresDominio WHERE DominioId = 14 ORDER BY Valor"
    $result2 = Invoke-Sqlcmd -ServerInstance '192.168.8.157,1433' -Database 'UB_Formacion' -Username 'sa' -Password 'Inno.2025$' -Query $query2
    $result2 | Format-Table Valor, Descripcion -AutoSize
    
    # Verificar Modalidad Impartición
    Write-Host "`nModalidad Impartición:" -ForegroundColor Yellow
    $query3 = "SELECT vd.Valor, vd.Descripcion FROM Dominios d JOIN ValoresDominio vd ON d.Id = vd.DominioId WHERE d.Nombre = 'MODALIDAD_IMPARTICION' ORDER BY vd.Valor"
    $result3 = Invoke-Sqlcmd -ServerInstance '192.168.8.157,1433' -Database 'UB_Formacion' -Username 'sa' -Password 'Inno.2025$' -Query $query3
    $result3 | Format-Table Valor, Descripcion -AutoSize
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
