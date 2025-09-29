# Script para corregir los dominios que no se insertaron correctamente
Write-Host "Corrigiendo dominios..." -ForegroundColor Green

try {
    # 1. Limpiar y corregir TIPOS_PARTICIPANTE_ROL
    Write-Host "`n1. Corrigiendo TIPOS_PARTICIPANTE_ROL..." -ForegroundColor Yellow
    
    $query1 = @"
-- Obtener ID del dominio TIPOS_PARTICIPANTE_ROL
DECLARE @TiposParticipanteRolId INT = (SELECT Id FROM Dominios WHERE Nombre = 'TIPOS_PARTICIPANTE_ROL');

-- Eliminar valores existentes
DELETE FROM ValoresDominio WHERE DominioId = @TiposParticipanteRolId;

-- Insertar todos los valores correctos
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion) VALUES
(@TiposParticipanteRolId, 'T17.01', 'Alumne'),
(@TiposParticipanteRolId, 'T17.02', 'Conferenciant'),
(@TiposParticipanteRolId, 'T17.03', 'Coordinador'),
(@TiposParticipanteRolId, 'T17.04', 'Dinamitzador'),
(@TiposParticipanteRolId, 'T17.05', 'Formador'),
(@TiposParticipanteRolId, 'T17.06', 'Membre'),
(@TiposParticipanteRolId, 'T17.07', 'Moderador'),
(@TiposParticipanteRolId, 'T17.08', 'Ponent'),
(@TiposParticipanteRolId, 'T17.09', 'Presentador'),
(@TiposParticipanteRolId, 'T17.10', 'SignadorActa'),
(@TiposParticipanteRolId, 'T17.11', 'Tallerista'),
(@TiposParticipanteRolId, 'T17.12', 'Tutor'),
(@TiposParticipanteRolId, 'T17.13', 'Administrador de proves escrites'),
(@TiposParticipanteRolId, 'T17.14', 'Administrador de proves orals'),
(@TiposParticipanteRolId, 'T17.15', 'Avaluador de proves de nivell'),
(@TiposParticipanteRolId, 'T17.16', 'Avaluador de proves orals'),
(@TiposParticipanteRolId, 'T17.17', 'Conductor de sessió informativa'),
(@TiposParticipanteRolId, 'T17.18', 'Corrector de proves escrites B2'),
(@TiposParticipanteRolId, 'T17.19', 'Corrector de proves escrites C1'),
(@TiposParticipanteRolId, 'T17.20', 'Corrector de proves escrites C1 PDI'),
(@TiposParticipanteRolId, 'T17.21', 'Corrector de proves escrites C2'),
(@TiposParticipanteRolId, 'T17.22', 'Corrector de proves escrites LJ'),
(@TiposParticipanteRolId, 'T17.23', 'Elaborador d''examen'),
(@TiposParticipanteRolId, 'T17.24', 'Elaborador de materials didàctics'),
(@TiposParticipanteRolId, 'T17.25', 'Elaborador de preguntes Àrea 4'),
(@TiposParticipanteRolId, 'T17.26', 'Elaborador de proves de nivell'),
(@TiposParticipanteRolId, 'T17.27', 'Elaborador de sessió informativa'),
(@TiposParticipanteRolId, 'T17.28', 'Elaborador d''informes de revisió'),
(@TiposParticipanteRolId, 'T17.29', 'Tasques de suport'),
(@TiposParticipanteRolId, 'T17.30', 'Tasques diverses'),
(@TiposParticipanteRolId, 'T17.31', 'Tutorització d''estudiants');

SELECT 'TIPOS_PARTICIPANTE_ROL corregido' as Resultado;
"@
    
    $result1 = Invoke-Sqlcmd -ServerInstance '192.168.8.157,1433' -Database 'UB_Formacion' -Username 'sa' -Password 'Inno.2025$' -Query $query1
    Write-Host "✅ $($result1.Resultado)" -ForegroundColor Green
    
    # 2. Limpiar y corregir Idioma (ID=14)
    Write-Host "`n2. Corrigiendo Idioma (ID=14)..." -ForegroundColor Yellow
    
    $query2 = @"
-- Eliminar valores existentes
DELETE FROM ValoresDominio WHERE DominioId = 14;

-- Insertar solo los 3 valores correctos
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion) VALUES
(14, 'ESP', 'Español'),
(14, 'CAT', 'Catalán'),
(14, 'ENG', 'Inglés');

SELECT 'Idioma (ID=14) corregido' as Resultado;
"@
    
    $result2 = Invoke-Sqlcmd -ServerInstance '192.168.8.157,1433' -Database 'UB_Formacion' -Username 'sa' -Password 'Inno.2025$' -Query $query2
    Write-Host "✅ $($result2.Resultado)" -ForegroundColor Green
    
    Write-Host "`n🎉 Correcciones completadas" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

