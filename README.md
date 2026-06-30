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
   - Copy `backend/env.example` to `backend/.env` and update values (DB credentials, JWT secret, client URL, `DAILY_WATER_GOAL_ML`).
   - Add `GEMINI_API_KEY=your_actual_api_key_here` to `backend/.env` to enable Gemini AI fallback.
   - (Optional) Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` + `VITE_WATER_GOAL_ML` to match your backend.
   - Ensure MySQL server is running and accessible via the credentials you set.

4. **Provision database**
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   - Run the database schema update script to apply fiber column and caching table:
     ```bash
     cd backend && node updateDatabase.js
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
   - Backend runs on `http://localhost:5001`

## AI-Assisted Meal Logging

Instead of requiring users to manually enter calories, protein, carbs, fats, etc., users can describe what they ate in plain English (e.g., *'2 bananas and 3 eggs'* or *'half plate of rice'*).

### How It Works

1. **Local Fast Parsing (Regex + Dictionary):**
   - The system first attempts to parse the query string locally using a custom JavaScript regex and NLP parser.
   - If the items match common patterns and foods in the local dictionary (e.g. *banana, egg, milk, apple, chapati, rice, tea, neer dosa, chicken biryani*), the system calculates nutrition values instantly without calling Gemini.

2. **Gemini AI Fallback (Complex Sentences):**
   - If the sentence is complex or contains unrecognized foods, the system sends **only** the text description to Gemini.
   - Gemini parses the input and extracts **only** food names and quantities, returning structured JSON.
   - **Important:** Gemini *never* invents or estimates calories/nutrition facts.

3. **Nutrition Lookup:**
   - Once food items and quantities are extracted (either locally or via Gemini), the backend looks up the exact nutritional information from the local dictionary, database cache, or **Open Food Facts API**.
   - If found, it scales the nutrients based on the parsed quantity.
   - The looked-up nutrition data is cached in the `food_cache` table to optimize future requests.

4. **Saves & Updates:**
   - The aggregated nutrition values (including **Fiber**, if available) are calculated and logged into the `meals` table.
   - The UI displays the success status, calculated calorie and macronutrient totals, and individual food breakdowns.
   - Existing charts and dashboard figures instantly update since data resides in the same table.

## Application Features

- **Authentication:** Secure signup/login with bcrypt-hashed passwords and JWT-protected routes.
- **Workout Tracker:** CRUD workouts (type, duration, calories, date).
- **AI-Assisted Meal Tracker:** Describe meals naturally (e.g., "500 ml milk") to automatically parse items, fetch nutrition facts, calculate totals (including fiber), and save.
- **Hydration Tracker:** Quick-add water buttons, CRUD logs, daily goal progress, and weekly history.
- **Body Metrics Tracker:** Record weight/body-fat trends with notes and view the latest snapshot on the dashboard.
- **Progress Dashboard:** Calorie summaries, macro breakdown, hydration progress, body metric highlights, recent workout charts (Recharts).
- **Exercise Library:** Searchable catalog with descriptions, media, and muscle groups.
- **Diet Suggestions:** Goal-based meal recommendations sourced from `meal_suggestions`.
- **Responsive UI:** Functional components, hooks, toasts, and reusable layout/utility classes.

## Backend Highlights

- Structured folders: `routes`, `controllers`, `models`, `validators`, `middleware`.
- MySQL connection pooling via `mysql2/promise`.
- Input validation with `express-validator`.
- Centralized async error handling and auth middleware.
- REST endpoints under `/api/**` covering auth, workouts, meals, hydration, body metrics, dashboard, exercises, and suggestions.

## Frontend Highlights

- React Router with protected layouts and auth context.
- Global toast + loading spinner components for consistent UX feedback.
- Axios services (`src/services/*`) for all backend entities.
- Dashboard components (`StatsCards`, chart wrappers, HydrationCard, BodyMetricCard) built with Recharts + custom visuals.
- Dedicated pages for login, signup, workouts, meals, hydration, body metrics, exercises, suggestions, and dashboard.
- Reusable layout (`AppLayout`, `Navbar`) and refreshed UI theming defined in `App.css`.

## Next Steps

- Add automated testing (Jest/React Testing Library, supertest).
- Extend dashboard with additional analytics or goal tracking.
- Containerize with Docker and add CI scripts if needed.
