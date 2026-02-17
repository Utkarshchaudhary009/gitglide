# Sessions API

Sessions are the core resource in the Jules REST API. A session represents a unit of work where Jules executes a coding task on your repository.

## Session States

Sessions progress through the following states:

| State                    | Description                                     |
| ------------------------ | ----------------------------------------------- |
| `QUEUED`                 | Session is waiting to be processed              |
| `PLANNING`               | Jules is analyzing the task and creating a plan |
| `AWAITING_PLAN_APPROVAL` | Plan is ready and waiting for user approval     |
| `AWAITING_USER_FEEDBACK` | Jules needs additional input from the user      |
| `IN_PROGRESS`            | Jules is actively working on the task           |
| `PAUSED`                 | Session is paused                               |
| `COMPLETED`              | Task completed successfully                     |
| `FAILED`                 | Task failed to complete                         |

## Endpoints

| Method | Endpoint                                    | Description          |
| ------ | ------------------------------------------- | -------------------- |
| POST   | `/v1alpha/sessions`                         | Create a new session |
| GET    | `/v1alpha/sessions`                         | List all sessions    |
| GET    | `/v1alpha/sessions/{sessionId}`             | Get a session        |
| DELETE | `/v1alpha/sessions/{sessionId}`             | Delete a session     |
| POST   | `/v1alpha/sessions/{sessionId}:sendMessage` | Send a message       |
| POST   | `/v1alpha/sessions/{sessionId}:approvePlan` | Approve a plan       |
