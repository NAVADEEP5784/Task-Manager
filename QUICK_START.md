# Quick Start

## Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Expected URL: `http://localhost:5000`

## Frontend

Open another terminal:

```bash
cd frontend
npm install
npm start
```

Expected URL: `http://localhost:3000`

## One Server For Sharing

Build the frontend:

```bash
cd frontend
npm install
npm run build
```

Run the backend server:

```bash
cd backend
pip install -r requirements.txt
python serve.py
```

Open:

```text
http://localhost:5000
```

People on the same Wi-Fi can use your computer's local IP address:

```text
http://YOUR_LOCAL_IP:5000
```

For people outside your network, use a tunnel or deploy the app. A tunnel gives
you a temporary public URL that forwards to port `5000`.

## Demo Account

Create one from the register page:

- Username: `testuser`
- Email: `test@example.com`
- Password: `test123`

## Quick Demo

1. Register.
2. Log in.
3. Create a project.
4. Refresh the dashboard.
5. Delete the project.
6. Sign out.

## Common Problems

If the frontend cannot reach the API, make sure Flask is running on port `5000`.

If login works but project requests fail, clear `localStorage`, log in again,
and retry.

If ports are already in use, stop the old process or change the port in
`backend/app.py` or the React start command.
