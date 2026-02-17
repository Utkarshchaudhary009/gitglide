# Activities API

Activities represent events that occur during a session. Use the Activities API to monitor progress, retrieve messages, and access artifacts like code changes.

## Endpoints

| Method | Endpoint                                                | Description                       |
| ------ | ------------------------------------------------------- | --------------------------------- |
| GET    | `/v1alpha/sessions/{sessionId}/activities`              | List all activities for a session |
| GET    | `/v1alpha/sessions/{sessionId}/activities/{activityId}` | Get a single activity             |

## Activity Types

Activities have different types based on what occurred:

| Type               | Description                      |
| ------------------ | -------------------------------- |
| `planGenerated`    | Jules has created a plan         |
| `planApproved`     | A plan was approved              |
| `userMessaged`     | A message from the user          |
| `agentMessaged`    | A message from Jules             |
| `progressUpdated`  | A status update during execution |
| `sessionCompleted` | Session finished successfully    |
| `sessionFailed`    | Session encountered an error     |

## Artifacts

Activities may include artifacts—outputs produced during execution:

- **ChangeSet**: Code changes produced
- **BashOutput**: Command output produced
- **Media**: Media file produced (e.g., image)
