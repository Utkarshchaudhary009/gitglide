# Approve a Plan

Approves a pending plan in a session. This endpoint is only needed when `requirePlanApproval` was set to `true` when creating the session.

**Endpoint:** `POST /v1alpha/sessions/{sessionId}:approvePlan`

## Path Parameters

| Parameter   | Type   | Description                      |
| ----------- | ------ | -------------------------------- |
| `sessionId` | string | The resource name of the session |

## Example Request

```bash
curl -X POST \
  -H "x-goog-api-key: $JULES_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}' \
  https://jules.googleapis.com/v1alpha/sessions/1234567:approvePlan
```

## Response

Returns an empty ApprovePlanResponse on success.
