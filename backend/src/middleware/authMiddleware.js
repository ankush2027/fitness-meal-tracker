import jwt from "jsonwebtoken";
import { findUserById } from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    [, token] = req.headers.authorization.split(" ");
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || jwtSecret === "supersecret") {
      console.warn("⚠️  Warning: Using default JWT secret. Set JWT_SECRET in production!");
    }

    const decoded = jwt.verify(token, jwtSecret || "supersecret");
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = { id: user.id, email: user.email, name: user.name, goal: user.goal };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

