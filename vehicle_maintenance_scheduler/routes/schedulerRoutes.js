const express = require("express");
const { Log } = require("../../logging_middleware/logger");
const { optimizeSchedule } = require("../services/schedulerService");

const router = express.Router();

router.post("/scheduler/optimize", async (req, res) => {
  try {
    Log("backend", "info", "routes", "Request received");

    const { depotId } = req.body; // ✅ FIXED
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header required" });
    }

    if (depotId === undefined || typeof depotId !== "number") {
      return res.status(400).json({ error: "Valid depotId required" });
    }

    const result = await optimizeSchedule(depotId, authHeader);

    res.json(result);
  } catch (error) {
    Log("backend", "error", "routes", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
