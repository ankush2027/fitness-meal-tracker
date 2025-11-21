# Fitness & Meal Tracker

A full-stack fitness and nutrition dashboard built with React, Express, and MySQL. Users can manage workouts, meals, visualize progress, browse exercises, and receive tailored meal suggestions.

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios, Recharts, CSS
- **Backend:** Node.js, Express, JWT, bcrypt, express-validator
- **Database:** MySQL (`mysql2` driver) with relational schema and sample data

## Project Structure

```
fitness-meal-tracker/
├── backend/          # Express app (routes, controllers, models)
├── frontend/         # React SPA (components, pages, services)
├── database/         # MySQL schema + seed data
└── README.md         # This guide
```

## macOS Intel Setup

1. **Install prerequisites**
   - Node.js 20+: `brew install node`
   - MySQL 8+: `brew install mysql && brew services start mysql`
   - Recommended: VS Code + official extensions for React/Node/MySQL

2. **Clone & install**
   ```bash
   cd /Users/Ankush/Desktop/fitness-meal-tracker
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure environment**
   - Copy `backend/env.example` to `backend/.env` and update values (DB credentials, JWT secret, client URL).
   - Ensure MySQL server is running and accessible via the credentials you set.

4. **Provision database**
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   - Demo credentials: `demo@example.com` / `Password123!`

5. **Run the apps**
   ```bash
   # Terminal 1 - backend
   cd backend
   npm run dev

   # Terminal 2 - frontend
   cd frontend
   npm run dev
   ```
   - Frontend runs on `http://localhost:5173`
   - Backend runs on `http://localhost:5000`

## Application Features

- **Authentication:** Secure signup/login with bcrypt-hashed passwords and JWT-protected routes.
- **Workout Tracker:** CRUD workouts (type, duration, calories, date).
- **Meal Tracker:** Log meals with macros and calories.
- **Progress Dashboard:** Calorie summaries, macro breakdown, recent workout charts (Recharts).
- **Exercise Library:** Searchable catalog with descriptions, media, and muscle groups.
- **Diet Suggestions:** Goal-based meal recommendations sourced from `meal_suggestions`.
- **Responsive UI:** Functional components, hooks, and reusable layout/utility classes.

## Backend Highlights

- Structured folders: `routes`, `controllers`, `models`, `validators`, `middleware`.
- MySQL connection pooling via `mysql2/promise`.
- Input validation with `express-validator`.
- Centralized async error handling and auth middleware.
- REST endpoints under `/api/**` covering auth, workouts, meals, dashboard, exercises, and suggestions.

## Frontend Highlights

- React Router with protected layouts and auth context.
- Axios services (`src/services/*`) for all backend entities.
- Dashboard components (`StatsCards`, chart wrappers) built with Recharts.
- Dedicated pages for login, signup, workouts, meals, exercises, suggestions, and dashboard.
- Reusable layout (`AppLayout`, `Navbar`) and UI utility classes defined in `App.css`.

## Next Steps

- Add automated testing (Jest/React Testing Library, supertest).
- Extend dashboard with additional analytics or goal tracking.
- Containerize with Docker and add CI scripts if needed.
