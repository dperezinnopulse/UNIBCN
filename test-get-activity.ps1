# Test script to get activity 26
Write-Host "Testing GET /api/actividades/26..." -ForegroundColor Green

# First, get a login token
Write-Host "Getting login token..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = "Admin"
        password = "Admin"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    Write-Host "Login successful" -ForegroundColor Green
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test getting activity 26
Write-Host "Testing GET /api/actividades/26..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/26" -Method GET -Headers $headers
    Write-Host "Activity retrieved successfully!" -ForegroundColor Green
    Write-Host "Activity ID: $($response.id)" -ForegroundColor Cyan
    Write-Host "Activity Title: $($response.titulo)" -ForegroundColor Cyan
} catch {
    Write-Host "Activity retrieval failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "Status Code: $statusCode" -ForegroundColor Yellow
    }
}

Write-Host "Test completed!" -ForegroundColor Green
