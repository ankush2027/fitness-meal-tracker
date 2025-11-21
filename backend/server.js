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
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_, res) => {
  res.json({ status: "ok", message: "Fitness & Meal Tracker API" });
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

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
