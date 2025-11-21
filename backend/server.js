import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./src/routes/authRoutes.js";
import workoutRoutes from "./src/routes/workoutRoutes.js";
import mealRoutes from "./src/routes/mealRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import exerciseRoutes from "./src/routes/exerciseRoutes.js";
import suggestionRoutes from "./src/routes/suggestionRoutes.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Health check endpoint
app.get("/", (_, res) => {
  res.json({ status: "ok", message: "Fitness & Meal Tracker API" });
});

app.get("/health", async (req, res) => {
  try {
    // Test database connection
    const db = (await import("./src/config/db.js")).default;
    await db.query("SELECT 1");
    res.json({ status: "healthy", database: "connected", timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message,
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/suggestions", suggestionRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log error details for debugging
  console.error("Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === "development";
  const message = isDevelopment
    ? err.message || "Internal server error"
    : "Internal server error";

  res.status(err.status || 500).json({
    message,
    ...(isDevelopment && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
