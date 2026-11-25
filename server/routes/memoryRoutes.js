
import express from "express";
import {
  getMemories,
  getMemoryById,
  createMemory,
  updateMemory,
  deleteMemory,
} from "../controllers/memoryController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All memory routes require authentication
router.use(authenticateToken);

// Retrieve all memories
router.get("/", getMemories);

// Retrieve one memory
router.get("/:id", getMemoryById);

// Create a memory
router.post("/", createMemory);

// Update a memory
router.patch("/:id", updateMemory);

// Soft-delete a memory
router.delete("/:id", deleteMemory);

export default router;
