# Activity

An activity represents a single event within a session.

## Fields

| Field              | Type             | Description                                                               |
| ------------------ | ---------------- | ------------------------------------------------------------------------- |
| `name`             | string           | The full resource name (e.g., 'sessions/{session}/activities/{activity}') |
| `id`               | string           | Output only. The activity ID                                              |
| `originator`       | string           | The entity that created this activity ('user', 'agent', or 'system')      |
| `description`      | string           | Output only. A description of this activity                               |
| `createTime`       | string           | Output only. When the activity was created                                |
| `artifacts`        | Artifact[]       | Output only. Artifacts produced by this activity                          |
| `planGenerated`    | PlanGenerated    | A plan was generated                                                      |
| `planApproved`     | PlanApproved     | A plan was approved                                                       |
| `userMessaged`     | UserMessaged     | The user posted a message                                                 |
| `agentMessaged`    | AgentMessaged    | Jules posted a message                                                    |
| `progressUpdated`  | ProgressUpdated  | A progress update occurred                                                |
| `sessionCompleted` | SessionCompleted | The session completed                                                     |
| `sessionFailed`    | SessionFailed    | The session failed                                                        |
