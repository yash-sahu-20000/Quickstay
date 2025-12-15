import express from "express";
import { verifyAdmin, verifyToken } from "../utils/verification.js";
import { seedAll } from "../controllers/seed.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, seedAll);

export default router;
