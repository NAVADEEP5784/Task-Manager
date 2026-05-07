# Task Manager

This is a small full-stack task manager built with Flask, SQLite, and React.
It has user login, private projects, and tasks that can be tracked by status and
priority.

I kept the app intentionally simple so it is easy to run and review. The backend
owns authentication, database models, and REST endpoints. The frontend handles
the login/register flow, dashboard, project list, and task overview.

## What It Does

- Register and log in users
- Keep users on protected pages only when they have a token
- Create and list projects for the logged-in user
- Show dashboard counts for projects and tasks
- Show tasks by project, priority, status, and due date
- Update task status from the dashboard
- Delete projects and tasks

## Stack

Backend:
- Flask
- Flask-SQLAlchemy
- Flask-JWT-Extended
- Flask-CORS
- SQLite

Frontend:
- React
- React Router
- Axios
- Plain CSS

## Project Layout

```text
backend/
  app.py              Flask app setup and blueprint registration
  config.py           App configuration
  models.py           User, Project, and Task models
  auth.py             Register and login routes
  api_users.py        User/profile routes
  api_projects.py     Project routes
  api_tasks.py        Task routes
  requirements.txt    Python packages

frontend/
  public/
  src/
    App.js
    AuthContext.js
    ProtectedRoute.js
    api.js
    index.css
    pages/
    components/
```

## Running It

Start the backend:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Start the frontend in a second terminal:

```bash
cd frontend
npm install
npm start
```

The API runs at `http://localhost:5000`.
The React app runs at `http://localhost:3000`.

## Sharing The App

For a single server that can be shared, build the frontend first:

```bash
cd frontend
npm run build
```

Then run Flask with Waitress:

```bash
cd backend
pip install -r requirements.txt
python serve.py
```

Visit `http://localhost:5000`.

For the same Wi-Fi network, share `http://YOUR_LOCAL_IP:5000`.
For public internet access, use a tunnel or deploy the app to a host. The app is
now set up so both the frontend and API work from the same public URL.

## Basic Test Flow

1. Register a user.
2. Log in.
3. Create a project.
4. Refresh the page and confirm the project is still there.
5. Add or update task data if the task UI is being tested.
6. Sign out and confirm protected pages redirect back to login.

## Notes

The SQLite database is created automatically when the Flask app starts. For a
real deployment, the JWT secret should come from an environment variable and the
database should be moved to something like PostgreSQL.
