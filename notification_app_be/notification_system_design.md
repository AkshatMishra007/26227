# Notification System Design

## 1. REST API Design

### GET /notifications

- Query parameters:
  - `studentID` (required): Filter notifications for specific student
  - `isRead` (optional): Filter by read status (true/false)
  - `type` (optional): Filter by notification type (Event/Result/Placement)
- Headers:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- Response format:

```json
{
  "notifications": [
    {
      "notificationID": "uuid",
      "studentID": 1042,
      "type": "Placement",
      "message": "Company hiring",
      "isRead": false,
      "createdAt": "2026-04-22 17:51:30"
    }
  ],
  "count": 1
}
```

## 2. Database Schema

### Table: notifications

```sql
CREATE TABLE notifications (
  notificationID VARCHAR(36) PRIMARY KEY,
  studentID INT NOT NULL,
  type ENUM('Event', 'Result', 'Placement') NOT NULL,
  message TEXT NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_student_read_time (studentID, isRead, createdAt DESC),
  INDEX idx_type (type)
);
```

## 3. SQL Query

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;
```

## 4. Optimization

- **Indexes**:
  - Composite index on (studentID, isRead, createdAt) for fast filtering and sorting
  - Index on type for filtering by notification type
- **Partitioning**: Partition by month on createdAt for large datasets
- **Archiving**: Move notifications older than 1 year to archive table

## 5. Caching

- Use Redis for caching unread notifications per student
- Cache key: `notifications:student:{studentID}:unread`
- TTL: 5 minutes
- Pagination: Add `limit` and `offset` parameters, default limit 20

## 6. Bulk Notification Pseudocode

```javascript
async function sendBulkNotifications(studentIds, message) {
  const promises = studentIds.map(async (studentId) => {
    try {
      await sendEmail(studentId, message);
      await saveToDB(studentId, message);
      await pushToApp(studentId, message);
    } catch (error) {
      // Retry logic
      await retrySend(studentId, message, 3);
    }
  });

  await Promise.all(promises);
}

async function retrySend(studentId, message, retries) {
  for (let i = 0; i < retries; i++) {
    try {
      await sendEmail(studentId, message);
      return;
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(1000 * (i + 1)); // Exponential backoff
    }
  }
}
```

## 7. Priority Logic

Priority weights:

- Placement: 3
- Result: 2
- Event: 1

```javascript
function calculatePriority(notifications) {
  return notifications
    .map((notification) => {
      let weight = 1;
      if (notification.type === "Placement") weight = 3;
      else if (notification.type === "Result") weight = 2;

      // Simple recency score (newer = higher)
      const age = Date.now() - new Date(notification.createdAt).getTime();
      const recencyScore = Math.max(0, 1000000 - age / 1000); // Arbitrary scale

      notification.priority = weight * recencyScore;
      return notification;
    })
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 10);
}
```
