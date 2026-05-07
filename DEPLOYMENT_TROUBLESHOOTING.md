# Cloud Deployment Troubleshooting Guide

## Why Your App Won't Deploy to Railway/Render

Common issues and their solutions:

---

## ✅ What I've Fixed

1. ✅ Added `gunicorn` to requirements.txt
2. ✅ Fixed config.py to support PostgreSQL for cloud
3. ✅ Fixed app.py to work with cloud WSGI servers
4. ✅ Updated Procfile for Railway/Render compatibility
5. ✅ Created Dockerfile for Docker-based deployment
6. ✅ Fixed build.sh with proper error handling
7. ✅ Added .dockerignore for clean builds

---

## 🚀 Deploy to Railway (RECOMMENDED - Easier than Render)

### Step 1: Push to GitHub

```bash
cd d:\AI
git add .
git commit -m "Fix: Cloud deployment configuration"
git push origin main
```

### Step 2: Go to Railway.app

1. Visit https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Select your repository
5. Railway auto-deploys!

### Step 3: Set Environment Variables

In Railway Dashboard:
1. Click your project
2. Go to "Variables"
3. Add these:

```
FLASK_ENV=production
JWT_SECRET_KEY=your-random-secret-key-here
DATABASE_URL=postgresql://...  (if using Railway Postgres)
```

Generate a secret key:
```python
import secrets
print(secrets.token_urlsafe(32))
```

### Step 4: Add PostgreSQL (Optional but Recommended)

1. In Railway: Click "New Service"
2. Select "PostgreSQL"
3. Copy the `DATABASE_URL`
4. Add to Variables

Done! Your app should be deployed.

---

## 🚀 Deploy to Render (More Detailed)

### Step 1: Create Account & Connect GitHub

1. https://render.com
2. Sign up with GitHub
3. Grant permissions

### Step 2: Deploy Backend Service

1. Click "New +" → "Web Service"
2. Select your repository
3. Fill in:
   - **Name**: task-manager-api
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt && cd frontend && npm install --legacy-peer-deps && npm run build`
   - **Start Command**: `gunicorn --chdir backend app:app`

4. Under "Environment":
   - `FLASK_ENV` = `production`
   - `JWT_SECRET_KEY` = (generate random key)

5. Click "Create Web Service"

### Step 3: Deploy Frontend (Static Site)

1. Click "New +" → "Static Site"
2. Select same repository
3. Fill in:
   - **Name**: task-manager-web
   - **Build Command**: `cd frontend && npm install --legacy-peer-deps && npm run build`
   - **Publish Directory**: `frontend/build`

4. Click "Create Static Site"

### Step 4: Update API URL in Frontend

Edit `frontend/src/api.js`:

```javascript
const API_BASE_URL = 'https://task-manager-api.onrender.com/api';
```

Push changes to trigger redeploy:
```bash
git add .
git commit -m "Update API URL for Render deployment"
git push origin main
```

---

## ❌ Common Deployment Errors & Fixes

### Error: "Build failed: python: not found"

**Cause**: Runtime not set correctly
**Fix**: 
- Railway: Should auto-detect from requirements.txt ✅ (now fixed)
- Render: Select "Python 3" explicitly

### Error: "gunicorn: command not found"

**Cause**: gunicorn not in requirements.txt
**Fix**: ✅ Already fixed! Gunicorn is now in requirements.txt

### Error: "Cannot find module/package X"

**Cause**: Missing dependency
**Fix**: Verify in `backend/requirements.txt`:
```
Flask==2.3.2
Flask-SQLAlchemy==3.0.5
Flask-JWT-Extended==4.4.4
Flask-Cors==4.0.0
SQLAlchemy==2.0.19
python-dotenv==1.0.0
werkzeug==2.3.6
gunicorn==21.2.0
```
✅ All included now!

### Error: "npm ERR! ERR! 404"

**Cause**: Old npm packages or missing --legacy-peer-deps
**Fix**: ✅ Already fixed in build.sh!
```bash
npm install --legacy-peer-deps
npm run build
```

### Error: "SQLite database not found"

**Cause**: SQLite files don't persist in cloud
**Fix**: 
1. Use PostgreSQL instead (recommended)
2. Or: Use SQLite with Railway's volume mount:
   - Add persistent directory: `/app/instance`

**Recommended**: Switch to PostgreSQL
```python
# In config.py (now supports both):
if DATABASE_URL env var set → Use PostgreSQL
else → Use SQLite locally
```

### Error: "Port 5000/8000 already in use"

**Cause**: Multiple instances running
**Fix**: 
- Render: Auto manages ports
- Railway: Auto manages ports
- Locally: Kill other processes:
  ```bash
  netstat -ano | findstr :5000
  taskkill /PID XXXXX /F
  ```

### Error: "Frontend not loading/showing 404"

**Cause**: Static files not built or path wrong
**Fix**: 
1. Check build succeeded:
   - Render/Railway dashboard → Logs
   - Should say "Build complete!"

2. Verify frontend build command:
   ```bash
   npm install --legacy-peer-deps
   npm run build
   ```

3. Check `frontend/build` folder exists after build

### Error: "API calls return 502/503"

**Cause**: Backend crashed
**Fix**:
1. Check logs in Railway/Render dashboard
2. Common issues:
   - Database connection failed
   - Missing environment variable
   - Syntax error in code

3. Solutions:
   - Verify DATABASE_URL is set
   - Verify JWT_SECRET_KEY is set
   - Check syntax errors: `python -m py_compile backend/app.py`

### Error: "502 Bad Gateway"

**Cause**: Backend not responding
**Fix**:
1. Check if service is running (dashboard)
2. Restart service:
   - Railway: Click "Redeploy"
   - Render: Click "Manual Deploy"
3. Check backend logs for errors

---

## ✅ Verification Checklist

Before deploying:

- [ ] `requirements.txt` has all dependencies including gunicorn
- [ ] `config.py` supports DATABASE_URL for cloud
- [ ] `app.py` doesn't use localhost/hardcoded paths
- [ ] `Procfile` uses correct command for gunicorn
- [ ] `frontend/build` exists (or will be built)
- [ ] `.env` file is NOT pushed to GitHub
- [ ] `JWT_SECRET_KEY` is set as environment variable
- [ ] GitHub repo is up to date: `git push origin main`

---

## 📊 Deployment Status Check

### Railway Dashboard
```
https://railway.app/dashboard → Your Project → Deployments
```

### Render Dashboard
```
https://dashboard.render.com → Your Service → Events
```

Check:
- ✅ Build status
- ✅ Deployment status
- ✅ Live logs

---

## 🔧 Manual Deployment Testing

### Test locally first:

```bash
# Backend
cd backend
pip install -r requirements.txt
gunicorn app:app

# Should work: http://localhost:8000/api/health
```

```bash
# Frontend
cd frontend
npm install --legacy-peer-deps
npm run build
npm start

# Should work: http://localhost:3000
```

### If local works but cloud doesn't:

1. Check build logs in Railway/Render
2. Verify environment variables match
3. Look for path issues (Windows paths won't work in cloud)
4. Check file permissions

---

## 🌐 Test Your Cloud Deployment

Once deployed:

```bash
# Test API
curl https://your-api-url.onrender.com/api/health
# Should return: {"status": "healthy"}

# Test frontend
https://your-app-url.onrender.com
# Should load the React app
```

---

## 📈 Performance Optimization

### For Better Build Times:
- Add `node_modules/` to `.dockerignore` ✅ Done
- Use `npm ci` instead of `npm install` (faster)
- Cache dependencies

### For Better Runtime:
- Use PostgreSQL instead of SQLite
- Add Redis caching
- Use Railway's faster tier

---

## 🆘 Still Having Issues?

### Check These Files Exist:

```
✅ Procfile
✅ build.sh
✅ Dockerfile
✅ requirements.txt (with gunicorn)
✅ backend/config.py (supports DATABASE_URL)
✅ backend/app.py
✅ frontend/build/ (after build)
```

### Check Your Git Repo:

```bash
git status  # Should be clean
git log     # Should show recent commits
git remote -v  # Should show GitHub remote
```

### Debug on Railway/Render:

1. Go to dashboard
2. Click your project
3. Go to "Logs"
4. Look for error messages
5. Search error + "fix" online

### Last Resort:

Rebuild from scratch:
```bash
cd d:\AI
rm -rf .git frontend/node_modules backend/venv
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOU/task-manager.git
git push -u origin main

# Then redeploy
```

---

## ✨ After Successful Deployment

Your app will be at:
- **Frontend**: `https://task-manager-web.onrender.com` (or your Railway domain)
- **API**: `https://task-manager-api.onrender.com/api` (or your Railway domain)

Anyone, anywhere, anytime can access it! 🎉

---

**All critical fixes have been applied. Your code is now cloud-ready!**
