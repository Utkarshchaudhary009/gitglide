# Get an Activity

Retrieves a single activity by ID.

**Endpoint:** `GET /v1alpha/sessions/{sessionId}/activities/{activityId}`

## Path Parameters

| Parameter    | Type   | Description        |
| ------------ | ------ | ------------------ |
| `sessionId`  | string | The parent session |
| `activityId` | string | The activity ID    |

## Example Request

```bash
curl -H "x-goog-api-key: $JULES_API_KEY" \
  https://jules.googleapis.com/v1alpha/sessions/1234567/activities/act2
```

## Response

Returns the full Activity object:

```json
{
  "name": "sessions/1234567/activities/act2",
  "id": "act2",
  "originator": "agent",
  "description": "Code changes ready",
  "createTime": "2024-01-15T11:00:00Z",
  "artifacts": [
    {
      "changeSet": {
        "source": "sources/github-myorg-myrepo",
        "gitPatch": {
          "baseCommitId": "a1b2c3d4",
          "unidiffPatch": "diff --git a/tests/auth.test.js...",
          "suggestedCommitMessage": "Add unit tests for authentication module"
        }
      }
    }
  ]
}
```
