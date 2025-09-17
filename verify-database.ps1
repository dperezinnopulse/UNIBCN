Write-Host "Verificando estado de la base de datos..." -ForegroundColor Yellow

# Verificar si las tablas existen
Write-Host "Verificando tablas..." -ForegroundColor Cyan
$tables = sqlcmd -S localhost -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME IN ('EstadosActividad', 'UnidadesGestion', 'Actividades')" -h -1

if ($tables -match "EstadosActividad") {
    Write-Host "✓ Tabla EstadosActividad existe" -ForegroundColor Green
} else {
    Write-Host "✗ Tabla EstadosActividad NO existe" -ForegroundColor Red
}

if ($tables -match "UnidadesGestion") {
    Write-Host "✓ Tabla UnidadesGestion existe" -ForegroundColor Green
} else {
    Write-Host "✗ Tabla UnidadesGestion NO existe" -ForegroundColor Red
}

if ($tables -match "Actividades") {
    Write-Host "✓ Tabla Actividades existe" -ForegroundColor Green
} else {
    Write-Host "✗ Tabla Actividades NO existe" -ForegroundColor Red
}

# Verificar datos en EstadosActividad
Write-Host "`nVerificando datos en EstadosActividad..." -ForegroundColor Cyan
$estadosCount = sqlcmd -S localhost -Q "SELECT COUNT(*) FROM EstadosActividad" -h -1
Write-Host "EstadosActividad tiene $estadosCount registros" -ForegroundColor White

if ([int]$estadosCount -eq 0) {
    Write-Host "Insertando datos de estados..." -ForegroundColor Yellow
    sqlcmd -S localhost -Q @"
    INSERT INTO EstadosActividad (Codigo, Nombre, Descripcion, Color, Orden, Activo, FechaCreacion) VALUES
    ('BORRADOR', 'Borrador', 'Actividad en estado borrador', '#6c757d', 1, 1, GETDATE()),
    ('REVISION', 'En Revisión', 'Actividad en proceso de revisión', '#ffc107', 2, 1, GETDATE()),
    ('APROBADO', 'Aprobado', 'Actividad aprobada', '#28a745', 3, 1, GETDATE()),
    ('RECHAZADO', 'Rechazado', 'Actividad rechazada', '#dc3545', 4, 1, GETDATE()),
    ('CANCELADO', 'Cancelado', 'Actividad cancelada', '#6c757d', 5, 1, GETDATE())
"@
}

# Verificar datos en UnidadesGestion
Write-Host "`nVerificando datos en UnidadesGestion..." -ForegroundColor Cyan
$unidadesCount = sqlcmd -S localhost -Q "SELECT COUNT(*) FROM UnidadesGestion" -h -1
Write-Host "UnidadesGestion tiene $unidadesCount registros" -ForegroundColor White

if ([int]$unidadesCount -eq 0) {
    Write-Host "Insertando datos de unidades de gestión..." -ForegroundColor Yellow
    sqlcmd -S localhost -Q @"
    INSERT INTO UnidadesGestion (Codigo, Nombre, Descripcion, Activo, FechaCreacion) VALUES
    ('IDP', 'IDP - Institut de Desenvolupament Professional', 'Institut de Desenvolupament Professional', 1, GETDATE()),
    ('CRAI', 'CRAI - Centre de Recursos per a l''Aprenentatge i la Investigació', 'Centre de Recursos per a l''Aprenentatge i la Investigació', 1, GETDATE()),
    ('SAE', 'SAE - Servei d''Activitats Extraordinàries', 'Servei d''Activitats Extraordinàries', 1, GETDATE())
"@
}

Write-Host "`nVerificación completada" -ForegroundColor Green
