# PERN Trello Board Implementation

The Mini Trello Board application has been successfully implemented with a full-stack architecture.

## Backend (Node.js + Express + PostgreSQL + Prisma)
- **Authentication**: JWT-based auth with bcrypt password hashing.
- **Roles**: Admin and User roles implemented.
- **Database Schema**:
  - `User`: Handles accounts and roles.
  - `Board`: Main project boards.
  - `Column`: Todo, In Progress, Done, etc.
  - `Task`: Draggable cards with title, description, assignee, and due date.
- **API Endpoints**:
  - `/api/auth`: Login and Registration.
  - `/api/boards`: Board CRUD (Admin restricted for creation/deletion).
  - `/api/tasks`: Task CRUD and status updates (for DnD).
  - `/api/users`: For task assignment.

## Frontend (React + Vite + @dnd-kit)
- **Modern UI**: Dark mode, glassmorphism, responsive grid.
- **Drag & Drop**: Tasks can be dragged between columns, persisting the state on the backend.
- **Filtering & Assignment**: Tasks show assignment info and can be filtered/managed.
- **Protected Routes**: Ensuring only logged-in users can access the dashboard.

## To Run the Application:
1. **Database**:
   - Ensure PostgreSQL is running.
   - Run `npx prisma migrate dev` in the `server` folder to sync the schema.
2. **Server**:
   - Run `npm start` (I'll add the dev script).
3. **Client**:
   - Run `npm run dev` in the `client` folder.

## Environment Variables:
- **Server**: `PORT`, `DATABASE_URL`, `JWT_SECRET`.
- **Client**: Requests `http://localhost:5000/api`.
