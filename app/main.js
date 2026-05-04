const express = require("express");
const { Log } = require("../logging_middleware/logger");
const schedulerRoutes = require("../vehicle_maintenance_scheduler/routes/schedulerRoutes");

const app = express();

app.use(express.json());

app.use("/api", schedulerRoutes);

app.get("/", (req, res) => {
  Log("backend", "info", "main", "Root endpoint accessed");
  res.json({ message: "Server running" });
});

const PORT = 3000;

app.listen(PORT, () => {
  Log("backend", "info", "main", `Server started on port ${PORT}`);
});
