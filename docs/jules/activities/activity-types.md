# Activity Types

Activities have different types based on what occurred. Each activity will have exactly one of these event fields populated.

## Plan Generated

Indicates Jules has created a plan for the task:

```json
{
  "planGenerated": {
    "plan": {
      "id": "plan1",
      "steps": [
        {
          "id": "step1",
          "index": 0,
          "title": "Step title",
          "description": "Details"
        }
      ],
      "createTime": "2024-01-15T10:31:00Z"
    }
  }
}
```

## Plan Approved

Indicates a plan was approved (by user or auto-approved):

```json
{
  "planApproved": {
    "planId": "plan1"
  }
}
```

## User Messaged

A message from the user:

```json
{
  "userMessaged": {
    "userMessage": "Please also add integration tests"
  }
}
```

## Agent Messaged

A message from Jules:

```json
{
  "agentMessaged": {
    "agentMessage": "I've completed the unit tests. Would you like me to add integration tests as well?"
  }
}
```

## Progress Updated

A status update during execution:

```json
{
  "progressUpdated": {
    "title": "Writing tests",
    "description": "Creating test cases for login functionality"
  }
}
```

## Session Completed

The session finished successfully:

```json
{
  "sessionCompleted": {}
}
```

## Session Failed

The session encountered an error:

```json
{
  "sessionFailed": {
    "reason": "Unable to install dependencies"
  }
}
```
