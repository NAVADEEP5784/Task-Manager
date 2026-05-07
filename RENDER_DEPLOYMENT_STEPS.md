# Render Deployment - Complete Setup Guide

## Prerequisites
- Render.com account (free tier available)
- GitHub repository synced (✅ done)
- Code with Gunicorn WSGI setup (✅ done)

---

## Step 1: Create New Web Service on Render

1. Go to **https://dashboard.render.com**
2. Click **"New +"** → Select **"Web Service"**
3. Choose **"Deploy an existing repository"**
4. Select your GitHub repo: **NAVADEEP5784/Task-Manager**
5. Click **"Connect"**

---

## Step 2: Configure Service Settings

### Basic Information
- **Name:** `task-manager` (or your preferred name)
- **Environment:** `Python 3`
- **Region:** Choose closest to your users (e.g., `Ohio` for US)
- **Branch:** `main` ✅

### Build & Deploy Settings
- **Root Directory:** Leave empty (root of repo)
- **Build Command:** 
  ```
  cd frontend && npm install --legacy-peer-deps && npm run build && cd .. && pip install --upgrade pip && pip install -r backend/requirements.txt
  ```
- **Start Command:**
  ```
  gunicorn --chdir backend wsgi:app
  ```

---

## Step 3: Add Environment Variables

Click **"Advanced"** → **"Environment"**

Add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `FLASK_ENV` | `production` | Required for cloud |
| `JWT_SECRET_KEY` | `your-secret-key-min-32-chars` | Generate strong key |
| `DATABASE_URL` | (leave empty initially) | Uses SQLite first |
| `PORT` | `8000` | Render default |

### Generate JWT_SECRET_KEY:

Run this command in your terminal:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output and use it as your `JWT_SECRET_KEY` value.

---

## Step 4: Optional - Add PostgreSQL Database

If you want persistent database (recommended):

1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Create a new PostgreSQL instance
3. After creation, copy the connection string
4. In your Web Service settings, add:
   - **Key:** `DATABASE_URL`
   - **Value:** `[paste the PostgreSQL URL]`

---

## Step 5: Deploy Settings (Important!)

- **Auto-Deploy:** Toggle **ON** (redeploys on GitHub push)
- **Paid Plan:** Free tier works but has limits
  - ⚠️ Free tier services spin down after 15 minutes of inactivity
  - 💡 Upgrade to "Starter" ($7/month) for always-on service

---

## Step 6: Click "Create Web Service"

Render will now:
1. ✅ Pull code from GitHub
2. ✅ Run build command (install dependencies)
3. ✅ Start Gunicorn with your app
4. ✅ Assign a public URL

**This takes 2-5 minutes.**

---

## Step 7: Monitor Deployment

Watch the logs in real-time:
- Render dashboard shows live build logs
- Look for: `Uvicorn running on` OR `Gunicorn started` ✅
- If error: Check **Logs** tab for issues

---

## Testing Your Deployment

Once deployed, you'll get a URL like:
```
https://task-manager-xxxxx.onrender.com
```

Test these endpoints:

1. **Health Check (API running?)**
   ```
   GET https://task-manager-xxxxx.onrender.com/api/health
   ```
   Expected: `{"status": "healthy"}`

2. **Frontend (UI loads?)**
   ```
   GET https://task-manager-xxxxx.onrender.com/
   ```
   Expected: React app loads

3. **Register New User**
   ```
   POST https://task-manager-xxxxx.onrender.com/api/auth/register
   Body: {"username": "test", "password": "test123"}
   ```

4. **Login**
   ```
   POST https://task-manager-xxxxx.onrender.com/api/auth/login
   Body: {"username": "test", "password": "test123"}
   ```

---

## Common Errors & Fixes

### ❌ "ModuleNotFoundError: No module named 'your_application'"
**Solution:** Make sure `Procfile` says `gunicorn --chdir backend wsgi:app`

### ❌ "Error: Command exited with status 1"
**Solution:** Check build command - likely npm or pip issue. View full logs.

### ❌ "Service exceeded free tier limits"
**Solution:** Upgrade to Starter plan or optimize app

### ❌ "Frontend not loading (blank page)"
**Solution:** 
- Check API base URL in frontend/src/api.js
- Should be relative path `/api` (not hardcoded localhost)

### ❌ "Database connection refused"
**Solution:** 
- Make sure `DATABASE_URL` is set correctly
- Or remove it to use SQLite instead

---

## Troubleshooting Checklist

- [ ] GitHub repo is public or Render has access
- [ ] `Procfile` exists in root directory
- [ ] `backend/wsgi.py` exists
- [ ] `backend/requirements.txt` has all dependencies
- [ ] Build command installs both npm and pip packages
- [ ] Start command points to `wsgi:app`
- [ ] `JWT_SECRET_KEY` is set in Environment
- [ ] `FLASK_ENV=production` is set
- [ ] Logs show no errors (click "Logs" tab in Render)

---

## Next Steps

1. **Deploy now** following steps 1-6 above
2. **Monitor logs** for any errors
3. **Test endpoints** using the testing section above
4. **Add database** if you want data to persist (PostgreSQL)
5. **Upgrade plan** if you need always-on service

---

## Quick Reference - Render Settings Summary

```
Build Command:
pip install --upgrade pip && npm install --legacy-peer-deps && npm run build && pip install -r backend/requirements.txt

Start Command:
gunicorn --chdir backend wsgi:app

Environment Variables:
FLASK_ENV=production
JWT_SECRET_KEY=[your-32-char-secret]
DATABASE_URL=[optional-postgres-url]
```

**You're ready to deploy! 🚀**
