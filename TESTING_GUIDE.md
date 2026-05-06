# Testing Guide

This is a manual checklist for checking the app before submission or demo.

## Before Testing

- Backend is running on `http://localhost:5000`.
- Frontend is running on `http://localhost:3000`.
- Browser console has no startup errors.
- The database has either fresh data or known test data.

## Authentication

- Register a new user.
- Try registering with the same username again and confirm an error appears.
- Try a short password and confirm validation catches it.
- Log in with the new user.
- Try a wrong password and confirm login fails.
- Refresh the dashboard and confirm the session is still active.
- Sign out and confirm protected pages are no longer available.

## Projects

- Create a project with only a name.
- Create a project with a name and description.
- Confirm the project count changes.
- Refresh the page and confirm projects are still listed.
- Delete a project and confirm it disappears.
- Try creating a project with an empty name and confirm it is rejected.

## Tasks

- Create or load a project that has tasks.
- Confirm tasks show the correct project name.
- Change a task status to `in_progress`.
- Change a task status to `completed`.
- Confirm the dashboard counts update.
- Delete a task and confirm the list updates.
- Try invalid task data and confirm the API returns an error.

## Permissions

- Create data as user A.
- Sign out.
- Register or log in as user B.
- Confirm user B does not see user A's projects.

## Browser Checks

- Open DevTools and watch the Network tab.
- Successful reads should return `200`.
- Successful creates should return `201`.
- Validation errors should return `400`.
- Missing or invalid tokens should return `401`.
- Unauthorized access should return `403`.

## Responsive Checks

Check these widths in browser responsive mode:

- `375px` for small mobile
- `768px` for tablet
- `1200px` for desktop

Make sure the project grid, forms, buttons, and task table remain usable.

## Final Pass

- No console errors.
- Backend terminal has no traceback.
- Registration and login work.
- Project creation works.
- Dashboard numbers update.
- Data survives a refresh.
- Sign out clears the session.
