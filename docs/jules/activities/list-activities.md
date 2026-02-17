# List Activities

Lists all activities for a session.

**Endpoint:** `GET /v1alpha/sessions/{sessionId}/activities`

## Path Parameters

| Parameter   | Type   | Description        |
| ----------- | ------ | ------------------ |
| `sessionId` | string | The parent session |

## Query Parameters

| Parameter   | Type    | Description                                         |
| ----------- | ------- | --------------------------------------------------- |
| `pageSize`  | integer | Number of activities to return (1-100). Default: 50 |
| `pageToken` | string  | Page token from a previous ListActivities response  |

## Example Request

```bash
curl -H "x-goog-api-key: $JULES_API_KEY" \
  "https://jules.googleapis.com/v1alpha/sessions/1234567/activities?pageSize=20"
```

## Response

```json
{
  "activities": [
    {
      "name": "sessions/1234567/activities/act1",
      "id": "act1",
      "originator": "system",
      "description": "Session started",
      "createTime": "2024-01-15T10:30:00Z"
    },
    {
      "name": "sessions/1234567/activities/act2",
      "id": "act2",
      "originator": "agent",
      "description": "Plan generated",
      "planGenerated": {
        "plan": {
          "id": "plan1",
          "steps": [
            {
              "id": "step1",
              "index": 0,
              "title": "Analyze existing code",
              "description": "Review the authentication module structure"
            }
          ],
          "createTime": "2024-01-15T10:31:00Z"
        }
      },
      "createTime": "2024-01-15T10:31:00Z"
    }
  ],
  "nextPageToken": "eyJvZmZzZXQiOjIwfQ=="
}
```
