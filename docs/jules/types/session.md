# Session

A session represents a unit of work where Jules executes a coding task.

## Fields

| Field                 | Type            | Description                                                      |
| --------------------- | --------------- | ---------------------------------------------------------------- |
| `name`                | string          | Output only. The full resource name (e.g., 'sessions/{session}') |
| `id`                  | string          | Output only. The session ID                                      |
| `prompt`              | string          | Required. The task description for Jules to execute              |
| `title`               | string          | Optional title. If not provided, the system generates one        |
| `state`               | SessionState    | Output only. Current state of the session                        |
| `url`                 | string          | Output only. URL to view the session in the Jules web app        |
| `sourceContext`       | SourceContext   | Required. The source repository and branch context               |
| `requirePlanApproval` | boolean         | Input only. If true, plans require explicit approval             |
| `automationMode`      | AutomationMode  | Input only. Automation mode for the session                      |
| `outputs`             | SessionOutput[] | Output only. Results of the session (e.g., pull requests)        |
| `createTime`          | string          | Output only. When the session was created                        |
| `updateTime`          | string          | Output only. When the session was last updated                   |
