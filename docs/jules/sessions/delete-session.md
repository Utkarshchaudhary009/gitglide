# Delete a Session

Deletes a session.

**Endpoint:** `DELETE /v1alpha/sessions/{sessionId}`

## Path Parameters

| Parameter   | Type   | Description                                |
| ----------- | ------ | ------------------------------------------ |
| `sessionId` | string | The resource name of the session to delete |

## Example Request

```bash
curl -X DELETE \
  -H "x-goog-api-key: $JULES_API_KEY" \
  https://jules.googleapis.com/v1alpha/sessions/1234567
```

## Response

Returns an empty response on success.
