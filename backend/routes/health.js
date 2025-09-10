// routes/health.js
import express from "express";
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

export default router;
