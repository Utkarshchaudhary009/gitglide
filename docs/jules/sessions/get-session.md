# Get a Session

Retrieves a single session by ID.

**Endpoint:** `GET /v1alpha/sessions/{sessionId}`

## Path Parameters

| Parameter   | Type   | Description                      |
| ----------- | ------ | -------------------------------- |
| `sessionId` | string | The resource name of the session |

## Example Request

```bash
curl -H "x-goog-api-key: $JULES_API_KEY" \
  https://jules.googleapis.com/v1alpha/sessions/1234567
```

## Response

Returns the full Session object including outputs if completed:

```json
{
  "name": "sessions/1234567",
  "id": "abc123",
  "prompt": "Add comprehensive unit tests for the authentication module",
  "title": "Add auth tests",
  "state": "COMPLETED",
  "url": "https://jules.google.com/session/abc123",
  "createTime": "2024-01-15T10:30:00Z",
  "updateTime": "2024-01-15T11:45:00Z",
  "outputs": [
    {
      "pullRequest": {
        "url": "https://github.com/myorg/myrepo/pull/42",
        "title": "Add auth tests",
        "description": "Added unit tests for authentication module"
      }
    }
  ]
}
```
