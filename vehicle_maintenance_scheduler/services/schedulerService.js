const axios = require("axios");
const { Log } = require("../../logging_middleware/logger");

const BASE_URL = "http://20.207.122.201/evaluation-service";

async function optimizeSchedule(depotId, authHeader) {
  try {
    const headers = {
      Authorization: authHeader,
    };

    // 🔹 Fetch depots
    const depotRes = await axios.get(`${BASE_URL}/depots`, { headers });
    const depots = depotRes.data?.data || depotRes.data;

    if (!Array.isArray(depots)) {
      throw new Error("Invalid depots response");
    }

    const depot = depots.find((d) => d.id === depotId);

    if (!depot) {
      throw new Error("Depot not found");
    }

    const capacity = depot.mechanicHours;

    // 🔹 Fetch vehicles
    const vehicleRes = await axios.get(`${BASE_URL}/vehicles`, { headers });
    const vehicles = vehicleRes.data?.data || vehicleRes.data;

    if (!Array.isArray(vehicles)) {
      throw new Error("Invalid vehicles response");
    }

    // 🔹 Greedy sort
    const sorted = vehicles.sort(
      (a, b) => b.impactScore / b.duration - a.impactScore / a.duration,
    );

    let totalDuration = 0;
    let totalImpact = 0;
    const selectedTasks = [];

    for (let v of sorted) {
      if (totalDuration + v.duration <= capacity) {
        selectedTasks.push(v);
        totalDuration += v.duration;
        totalImpact += v.impactScore;
      }
    }

    return {
      depotId,
      totalDuration,
      totalImpact,
      selectedTasks,
    };
  } catch (error) {
    Log("backend", "error", "service", error.message);
    throw error;
  }
}

module.exports = { optimizeSchedule };
