# Test script to verify activity update functionality
Write-Host "🧪 Testing activity update functionality..." -ForegroundColor Green

# Test the API endpoints that were fixed
$baseUrl = "http://localhost:5001"
$activityId = 26

Write-Host "🔍 Testing endpoint: /api/actividades/$activityId/colaboradoras" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/actividades/$activityId/colaboradoras" -Method GET
    Write-Host "✅ Colaboradoras endpoint working: $($response.Count) items" -ForegroundColor Green
} catch {
    Write-Host "❌ Colaboradoras endpoint error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🔍 Testing endpoint: /api/actividades/$activityId/importes" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/actividades/$activityId/importes" -Method GET
    Write-Host "✅ Importes endpoint working: $($response.Count) items" -ForegroundColor Green
} catch {
    Write-Host "❌ Importes endpoint error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🔍 Testing endpoint: /api/actividades/$activityId/participantes" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/actividades/$activityId/participantes" -Method GET
    Write-Host "✅ Participantes endpoint working: $($response.Count) items" -ForegroundColor Green
} catch {
    Write-Host "❌ Participantes endpoint error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🔍 Testing endpoint: /api/actividades/$activityId/subactividades" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/actividades/$activityId/subactividades" -Method GET
    Write-Host "✅ Subactividades endpoint working: $($response.Count) items" -ForegroundColor Green
} catch {
    Write-Host "❌ Subactividades endpoint error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🎯 Test completed!" -ForegroundColor Green
