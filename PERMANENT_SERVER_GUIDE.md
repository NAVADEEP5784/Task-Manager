# Permanent Live Server Setup Guide

This guide explains how to set up and run your Task Manager application as a permanent live server that runs continuously.

## Quick Start

### Option 1: Simple Startup (Windows)

**Using Batch File:**
```bash
Double-click: start_server.bat
```

**Using PowerShell:**
```powershell
Right-click start_server.ps1 → Run with PowerShell
```

The server will start on `http://localhost:5000`

---

## Server Options

### Development Mode
```bash
cd backend
python app.py
```
- Flask development server with hot reload
- Debug mode enabled
- Slower, for development only

### Production Mode
```bash
cd backend
python run_production.py
```
- Waitress WSGI server (production-grade)
- Multiple worker threads
- Faster, stable, suitable for production

---

## Option 2: Auto-Start on System Boot (Windows)

To make the server start automatically every time your computer boots up:

### Step 1: Run Setup Script as Administrator

```powershell
# Option A: Using PowerShell (as Administrator)
cd D:\AI
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
python setup_auto_start.py

# Option B: Using Command Prompt (as Administrator)
cd D:\AI
python setup_auto_start.py
```

### Step 2: Verify Task was Created

```powershell
# List all tasks
Get-ScheduledTask | Where-Object {$_.TaskName -like "*TaskManager*"}

# Or in Command Prompt
schtasks /query /tn "TaskManagerServer"
```

### Step 3: Test Auto-Start
- Reboot your computer
- The server should start automatically
- Access it at `http://localhost:5000`

### To Remove Auto-Start Task
```powershell
python setup_auto_start.py --remove
```

---

## Option 3: Run as Windows Service (Advanced)

Using NSSM (Non-Sucking Service Manager):

### Step 1: Download NSSM
```powershell
# Download from: https://nssm.cc/download
# Extract to: C:\nssm
```

### Step 2: Create Service
```powershell
# Run as Administrator
C:\nssm\win64\nssm.exe install TaskManagerServer "D:\AI\start_server.bat"
```

### Step 3: Start Service
```powershell
nssm start TaskManagerServer
```

### To View Service Status
```powershell
Get-Service TaskManagerServer
```

### To Remove Service
```powershell
C:\nssm\win64\nssm.exe remove TaskManagerServer confirm
```

---

## Monitoring the Server

### Check if Server is Running
```powershell
# Check port 5000
netstat -ano | findstr :5000

# Or using curl
curl http://localhost:5000/api/health
```

### View Server Logs

**When running with start_server.bat/ps1:**
- Logs appear in the console window
- Keep the window open to monitor

**When running as a service:**
- Check Event Viewer for errors
- Or configure log file output

---

## Environment Variables

You can customize the server behavior:

```powershell
# Set custom port (default: 5000)
$env:PORT = 8080

# Set number of worker threads (default: 4)
$env:THREADS = 8

# Then run:
python run_production.py
```

---

## Startup Script Details

### start_server.bat
- Windows batch file
- Double-click to run
- Automatically:
  1. Creates Python virtual environment
  2. Installs dependencies
  3. Builds frontend (if needed)
  4. Starts production server

### start_server.ps1
- PowerShell script
- Right-click → Run with PowerShell
- Same functionality as .bat file
- Better error messages

### run_production.py
- Pure Python production runner
- Uses Waitress WSGI server
- Set `FLASK_ENV=production` for production mode

---

## Performance Configuration

### For Better Performance

Increase worker threads:
```powershell
$env:THREADS = 16
python run_production.py
```

### For More Stability

Default (4 threads) is stable for most uses.

---

## Troubleshooting

### Port Already in Use
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Get process details
tasklist /fi "PID eq XXXXX"

# Kill the process
taskkill /PID XXXXX /F

# Change port
$env:PORT = 5001
python run_production.py
```

### Virtual Environment Issues
```powershell
# Delete and recreate venv
rm -r backend/venv
python -m venv backend/venv
backend/venv/Scripts/Activate.ps1
pip install -r backend/requirements.txt
```

### Frontend Not Loading
```powershell
# Rebuild frontend
cd frontend
npm install
npm run build
cd ..
```

---

## Server Status Endpoints

Once the server is running, you can check:

```bash
# Health check
curl http://localhost:5000/api/health

# Response: {"status": "healthy"}
```

---

## Keeping Server Updated

Before starting the server:
```powershell
# Update dependencies
pip install -r backend/requirements.txt --upgrade

# Update frontend
cd frontend && npm update && cd ..
```

---

## Summary

| Method | Ease | Auto-Start | Use Case |
|--------|------|-----------|----------|
| `start_server.bat` | ⭐⭐⭐ | ❌ | Manual start, easy |
| Task Scheduler | ⭐⭐ | ✅ | Auto-start on boot |
| Windows Service | ⭐ | ✅ | Professional/Enterprise |
| Command Line | ⭐⭐ | ❌ | Development |

---

## Getting Help

If the server doesn't start:

1. Check if Python is installed: `python --version`
2. Check logs in the console window
3. Ensure dependencies are installed: `pip install -r requirements.txt`
4. Verify frontend is built: Check if `frontend/build` folder exists
5. Check port 5000 is not already in use: `netstat -ano | findstr :5000`

---

**Server is now ready for production use!**
