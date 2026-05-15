# Quick start script for FPS Game (PowerShell)
# Change to the game directory and start a local server

Push-Location $PSScriptRoot
Write-Host "Starting FPS Game Server..." -ForegroundColor Green
Write-Host ""
Write-Host "The game will open at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

python -m http.server 8000
