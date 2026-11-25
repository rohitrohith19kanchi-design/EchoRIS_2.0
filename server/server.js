import memoryRoutes from "./routes/memoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

dotenv.config();

const app = express();
const PORT = 5000;
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please try again later.",
  },
});

app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json({ limit: "10kb" }));
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/memories", memoryRoutes);

// Basic health-check route
app.get("/", (req, res) => {
  res.send("EchoRIS backend is running!");
});

// Database connection test
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "EchoRIS database connected successfully!",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database test failed:", error.message);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`EchoRIS backend running on http://localhost:${PORT}`);
});
