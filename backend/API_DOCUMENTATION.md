# API Documentation

Base URL:

```text
http://localhost:5000/api
```

Protected routes need this header:

```text
Authorization: Bearer <access_token>
```

## Auth

### Register

`POST /auth/register`

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "test123"
}
```

Returns the new user.

### Login

`POST /auth/login`

```json
{
  "username": "testuser",
  "password": "test123"
}
```

Returns an `access_token` and the user object.

## Users

### Current Profile

`GET /users/profile`

Returns the logged-in user.

### User By Id

`GET /users/<user_id>`

Returns a user if the requester is that user or an admin.

### All Users

`GET /users`

Admin only.

### Update User

`PUT /users/<user_id>`

Updates username, email, or role. Role changes are admin only.

## Projects

### List Projects

`GET /projects`

Returns projects owned by the logged-in user.

### Create Project

`POST /projects`

```json
{
  "name": "Task manager",
  "description": "Optional notes"
}
```

### Get Project

`GET /projects/<project_id>`

Returns one project if it belongs to the logged-in user.

### Update Project

`PUT /projects/<project_id>`

```json
{
  "name": "Updated name",
  "description": "Updated description",
  "status": "active"
}
```

Allowed status values: `active`, `archived`.

### Delete Project

`DELETE /projects/<project_id>`

Deletes the project and its tasks.

## Tasks

### Tasks For Project

`GET /tasks/project/<project_id>`

Returns tasks for one project.

### Create Task

`POST /tasks`

```json
{
  "project_id": 1,
  "title": "Write docs",
  "description": "Clean up markdown files",
  "priority": "medium",
  "due_date": "2026-05-07T18:00:00"
}
```

Allowed priorities: `low`, `medium`, `high`.

### Get Task

`GET /tasks/<task_id>`

Returns one task if the task belongs to one of the user's projects.

### Update Task

`PUT /tasks/<task_id>`

```json
{
  "title": "Updated title",
  "status": "completed",
  "priority": "high"
}
```

Allowed statuses: `pending`, `in_progress`, `completed`.

### Delete Task

`DELETE /tasks/<task_id>`

Deletes one task.

## Status Codes

- `200` success
- `201` created
- `400` validation error
- `401` missing or invalid token
- `403` not allowed
- `404` not found
- `409` duplicate username or email
- `500` server error
