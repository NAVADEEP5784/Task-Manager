@echo off
REM Task Manager Application - Production Server Startup
REM This script starts the application on port 5000

setlocal enabledelayedexpansion

cd /d "%~dp0"

echo.
echo ========================================
echo Task Manager - Production Server
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ and add it to your PATH
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv\" (
    echo Virtual environment not found. Creating one...
    python -m venv venv
    if errorlevel 1 (
        echo Error creating virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo Error activating virtual environment
    pause
    exit /b 1
)

REM Install/update dependencies
echo Installing dependencies...
pip install -r requirements.txt -q
if errorlevel 1 (
    echo Error installing dependencies
    pause
    exit /b 1
)

REM Build frontend if needed
cd ..
if not exist "frontend\build\" (
    echo Building frontend...
    cd frontend
    call npm install -q
    call npm run build
    if errorlevel 1 (
        echo Error building frontend
        pause
        exit /b 1
    )
    cd ..
)
cd backend

echo.
echo ========================================
echo Starting Server
echo ========================================
echo.
echo Server running on http://localhost:5000
echo Press CTRL+C to stop the server
echo.

REM Start production server
set FLASK_ENV=production
python run_production.py

pause
