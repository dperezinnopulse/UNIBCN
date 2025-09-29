# Test script to verify frontend activity update
Write-Host "Testing frontend activity update..." -ForegroundColor Green

# Check if services are running
Write-Host "Checking services..." -ForegroundColor Yellow
$backendStatus = netstat -an | findstr ":5001"
$frontendStatus = netstat -an | findstr ":8080"

if ($backendStatus) {
    Write-Host "✅ Backend running on port 5001" -ForegroundColor Green
} else {
    Write-Host "❌ Backend not running on port 5001" -ForegroundColor Red
}

if ($frontendStatus) {
    Write-Host "✅ Frontend running on port 8080" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend not running on port 8080" -ForegroundColor Red
}

Write-Host "`nFrontend URL: http://localhost:8080/editar-actividad.html?id=26" -ForegroundColor Cyan
Write-Host "Please test the activity update functionality manually in the browser." -ForegroundColor Yellow
Write-Host "`nExpected behavior:" -ForegroundColor Yellow
Write-Host "- Page should load without errors" -ForegroundColor White
Write-Host "- Dropdowns should be populated" -ForegroundColor White
Write-Host "- Save button should work without HTTP 500 error" -ForegroundColor White
Write-Host "- Activity should be updated successfully" -ForegroundColor White

Write-Host "`nTest completed!" -ForegroundColor Green
