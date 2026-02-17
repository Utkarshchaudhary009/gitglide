# Create a Session

Creates a new session to start a coding task.

**Endpoint:** `POST /v1alpha/sessions`

## Request Body

| Field                 | Type          | Required | Description                               |
| --------------------- | ------------- | -------- | ----------------------------------------- |
| `prompt`              | string        | Yes      | The task description for Jules to execute |
| `title`               | string        | No       | Optional title for the session            |
| `sourceContext`       | SourceContext | Yes      | The source repository and branch context  |
| `requirePlanApproval` | boolean       | No       | If true, plans require explicit approval  |
| `automationMode`      | string        | No       | Use 'AUTO_CREATE_PR' to auto-create PRs   |

## Example Request

```bash
curl -X POST \
  -H "x-goog-api-key: $JULES_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Add comprehensive unit tests for the authentication module",
    "title": "Add auth tests",
    "sourceContext": {
      "source": "sources/github-myorg-myrepo",
      "githubRepoContext": {
        "startingBranch": "main"
      }
    },
    "requirePlanApproval": true
  }' \
  https://jules.googleapis.com/v1alpha/sessions
```

## Response

Returns the created Session object:

```json
{
  "name": "sessions/1234567",
  "id": "abc123",
  "prompt": "Add comprehensive unit tests for the authentication module",
  "title": "Add auth tests",
  "state": "QUEUED",
  "url": "https://jules.google.com/session/abc123",
  "createTime": "2024-01-15T10:30:00Z",
  "updateTime": "2024-01-15T10:30:00Z"
}
```
