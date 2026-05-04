# Campus Hiring Evaluation Backend

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Open http://localhost:3000 in the browser or Postman.

## Project Entry Point

The application starts from `app/main.js`.
The old demo file `index.js` has been removed to avoid confusion.

## Authentication

1. Register on the evaluation server using Postman:
   - POST `http://20.207.122.201/evaluation-service/register`
   - Body: JSON with `email`, `name`, `mobileNo`, `githubUsername`, `rollNo`, `accessCode`

2. Get access token:
   - POST `http://20.207.122.201/evaluation-service/auth`
   - Body: JSON with `email`, `name`, `rollNo`, `accessCode`, `clientID`, `clientSecret`

3. Use token in API requests:
   - Header: `Authorization: Bearer <token>`

## Testing APIs

### Vehicle Maintenance Scheduler

POST `http://localhost:3000/api/scheduler/optimize`

- Body example:

  ```json
  {
    "depotID": 1
  }
  ```

- Response includes:
  - `depotID`
  - `availableMechanicHours`
  - `remainingHours`
  - `selectedTasks`
  - `totalImpact`
  - `totalDuration`

### External Evaluation APIs

The scheduler service fetches live data from the evaluation server:

- GET `http://20.207.122.201/evaluation-service/depots`
- GET `http://20.207.122.201/evaluation-service/vehicles`

## Project Structure

- `app/main.js`: Express app entrypoint
- `logging_middleware/logger.js`: Custom logging utility
- `vehicle_maintenance_scheduler/routes/schedulerRoutes.js`: Scheduler API route
- `vehicle_maintenance_scheduler/services/schedulerService.js`: Scheduler logic and external API calls
- `vehicle_maintenance_scheduler/data/tempData.json`: sample data placeholder
- `notification_app_be/notification_system_design.md`: notification system design and interview-ready deliverable
- `api-responses.json`: stored API response examples

## Implementation Notes

- Uses in-memory caching for external API data
- No database is required
- Uses simple student-level greedy optimization
- Logging is implemented with `Log(stack, level, package, message)`

## Helpful Testing Tip

If you see a 404 on `/api/scheduler/optimize`, make sure the server is running from `app/main.js` and not from any old demo entrypoint.
