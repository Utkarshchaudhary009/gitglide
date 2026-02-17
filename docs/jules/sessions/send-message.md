# Send a Message

Sends a message from the user to an active session. Use this endpoint to provide feedback, answer questions, or give additional instructions to Jules during an active session.

**Endpoint:** `POST /v1alpha/sessions/{sessionId}:sendMessage`

## Path Parameters

| Parameter   | Type   | Description                      |
| ----------- | ------ | -------------------------------- |
| `sessionId` | string | The resource name of the session |

## Request Body

| Field    | Type   | Required | Description                        |
| -------- | ------ | -------- | ---------------------------------- |
| `prompt` | string | Yes      | The message to send to the session |

## Example Request

```bash
curl -X POST \
  -H "x-goog-api-key: $JULES_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Please also add integration tests for the login flow"
  }' \
  https://jules.googleapis.com/v1alpha/sessions/1234567:sendMessage
```

## Response

Returns an empty SendMessageResponse on success.
