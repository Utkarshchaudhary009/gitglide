# List Sessions

Lists all sessions for the authenticated user.

**Endpoint:** `GET /v1alpha/sessions`

## Query Parameters

| Parameter   | Type    | Description                                       |
| ----------- | ------- | ------------------------------------------------- |
| `pageSize`  | integer | Number of sessions to return (1-100). Default: 30 |
| `pageToken` | string  | Page token from a previous ListSessions response  |

## Example Request

```bash
curl -H "x-goog-api-key: $JULES_API_KEY" \
  "https://jules.googleapis.com/v1alpha/sessions?pageSize=10"
```

## Response

```json
{
  "sessions": [
    {
      "name": "sessions/1234567",
      "id": "abc123",
      "title": "Add auth tests",
      "state": "COMPLETED",
      "createTime": "2024-01-15T10:30:00Z",
      "updateTime": "2024-01-15T11:45:00Z"
    }
  ],
  "nextPageToken": "eyJvZmZzZXQiOjEwfQ=="
}
```
