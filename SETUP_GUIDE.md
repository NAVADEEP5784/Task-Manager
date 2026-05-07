# Setup Guide

These are the steps I use to run the project locally.

## Requirements

- Python 3.8 or newer
- Node.js and npm
- SQLite, which is included with normal Python installs

## Backend Setup

From the project root:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Flask creates the SQLite database on startup if it does not exist. The backend
serves the API at `http://localhost:5000/api`.

## Frontend Setup

In a second terminal:

```bash
cd frontend
npm install
npm start
```

React opens at `http://localhost:3000`.

## Running As One Live Server

For sharing, build React and let Flask serve the built files.

```bash
cd frontend
npm install
npm run build
```

Then run the backend with Waitress:

```bash
cd backend
pip install -r requirements.txt
python serve.py
```

Open `http://localhost:5000`.

If another device is on the same network, it can use:

```text
http://YOUR_LOCAL_IP:5000
```

On Windows, find your local IP with:

```bash
ipconfig
```

Look for the IPv4 address under your active Wi-Fi or Ethernet adapter.

For access from anywhere on the internet, put port `5000` behind a public tunnel
or deploy the app to a hosting service. Do not share the Flask debug server.

## Optional Frontend API URL

By default the frontend calls `http://localhost:5000/api`.

To override it, create `frontend/.env`:

```text
REACT_APP_API_URL=http://localhost:5000/api
```

Restart the frontend after changing `.env`.

## Resetting Local Data

Stop the backend, delete the SQLite database file, then start Flask again.

On Windows:

```bash
del backend\instance\app.db
```

On macOS or Linux:

```bash
rm backend/instance/app.db
```

Depending on how the app was started earlier, there may also be an older
`backend/database.db`. The current Flask config uses `backend/instance/app.db`.

## Troubleshooting

Port `5000` is busy:

```bash
netstat -ano | findstr :5000
```

Then stop the process, or change the Flask port in `backend/app.py`.

Frontend install fails:

```bash
cd frontend
npm cache clean --force
npm install
```

Python package install fails:

```bash
cd backend
python --version
pip install --upgrade pip
pip install -r requirements.txt
```

Login or protected requests fail:

1. Clear browser local storage.
2. Log in again.
3. Check the browser Network tab for the failing request.
4. Check the Flask terminal for the backend error.

## Production Notes

For deployment, do not use the development server. Set a real
`JWT_SECRET_KEY`, turn off debug mode, use HTTPS, and move the database to a
production database service.
