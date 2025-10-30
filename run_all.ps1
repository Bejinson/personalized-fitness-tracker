# Starts backend and frontend in new PowerShell windows
# Usage: Right-click -> Run with PowerShell, or run from a terminal: .\run_all.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting backend and frontend from: $root" -ForegroundColor Cyan

$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'

Start-Process powershell -ArgumentList "-NoExit -Command cd '$backend'; npm install; npm start" -WindowStyle Normal
Start-Process powershell -ArgumentList "-NoExit -Command cd '$frontend'; npm install; npm run dev" -WindowStyle Normal

Write-Host "Launched backend and frontend in separate PowerShell windows." -ForegroundColor Green
Write-Host "If you prefer a single terminal, run these commands manually from the repository root:" -ForegroundColor Yellow
Write-Host "  cd ./backend; npm install; npm start" -ForegroundColor Yellow
Write-Host "  cd ./frontend; npm install; npm run dev" -ForegroundColor Yellow

