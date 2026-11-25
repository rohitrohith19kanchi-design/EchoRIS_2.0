
import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { display_name, email, password } = req.body;

    if (
  typeof display_name !== "string" ||
  typeof email !== "string" ||
  typeof password !== "string" ||
  !display_name.trim() ||
  display_name.trim().length > 80 ||
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
  email.trim().length > 254 ||
  password.length < 8 ||
  Buffer.byteLength(password, "utf8") > 72
) {
  return res.status(400).json({
    message: "Invalid registration details. Check your name, email and password.",
  });
} 
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (display_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, display_name, email, created_at`,
      [display_name.trim(), normalizedEmail, passwordHash]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      message: "Account created successfully!",
      token,
      user,
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({
      message: "Could not create account.",
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const result = await pool.query(
      `SELECT id, display_name, email, password_hash
       FROM users
       WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user.id);

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        display_name: user.display_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      message: "Could not log in.",
    });
  }
};
