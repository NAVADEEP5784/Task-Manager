# Task Manager Application - Production Server Startup
# PowerShell script to start the application on port 5000

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Task Manager - Production Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set location to backend directory
$backendDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ((Split-Path -Leaf $backendDir) -eq "backend") {
    Set-Location $backendDir
} else {
    Set-Location "$backendDir\backend"
}

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ and add it to your PATH"
    Read-Host "Press Enter to exit"
    exit 1
}

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error creating virtual environment" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error activating virtual environment" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install/update dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Build frontend if needed
$frontendBuildPath = "..\frontend\build"
if (-not (Test-Path $frontendBuildPath)) {
    Write-Host "Building frontend..." -ForegroundColor Yellow
    Set-Location "..\frontend"
    npm install -q
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error building frontend" -ForegroundColor Red
        Set-Location "..\backend"
        Read-Host "Press Enter to exit"
        exit 1
    }
    Set-Location "..\backend"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server running on http://localhost:5000" -ForegroundColor Green
Write-Host "Press CTRL+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start production server
$env:FLASK_ENV = "production"
python run_production.py

Read-Host "Press Enter to exit"
