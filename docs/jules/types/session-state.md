# SessionState

Enum representing the current state of a session:

| Value                    | Description                        |
| ------------------------ | ---------------------------------- |
| `STATE_UNSPECIFIED`      | State is unspecified               |
| `QUEUED`                 | Session is waiting to be processed |
| `PLANNING`               | Jules is creating a plan           |
| `AWAITING_PLAN_APPROVAL` | Plan is ready for user approval    |
| `AWAITING_USER_FEEDBACK` | Jules needs user input             |
| `IN_PROGRESS`            | Jules is actively working          |
| `PAUSED`                 | Session is paused                  |
| `FAILED`                 | Session failed                     |
| `COMPLETED`              | Session completed successfully     |
