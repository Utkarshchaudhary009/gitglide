# Jules API Overview

The Jules REST API allows you to programmatically create and manage coding sessions, monitor progress, and retrieve results.

## Base URL

```
https://jules.googleapis.com/v1alpha
```

## Authentication

The Jules REST API uses API keys for authentication. Get your API key from [jules.google.com/settings](https://jules.google.com/settings).

```bash
curl -H "x-goog-api-key: $JULES_API_KEY" \
  https://jules.googleapis.com/v1alpha/sessions
```

## Endpoints

| Endpoint                           | Description                                 |
| ---------------------------------- | ------------------------------------------- |
| [Sessions](sessions/README.md)     | Create and manage coding sessions           |
| [Activities](activities/README.md) | Monitor session progress through activities |
| [Sources](sources/README.md)       | List and retrieve connected repositories    |
| [Types](types/README.md)           | Reference for all data types                |

## Common Patterns

### Pagination

List endpoints support pagination using `pageSize` and `pageToken` parameters:

```bash
# First page
curl -H "x-goog-api-key: $JULES_API_KEY" \
  "https://jules.googleapis.com/v1alpha/sessions?pageSize=10"

# Next page
curl -H "x-goog-api-key: $JULES_API_KEY" \
  "https://jules.googleapis.com/v1alpha/sessions?pageSize=10&pageToken=NEXT_PAGE_TOKEN"
```

### Resource Names

Resources use hierarchical names following Google API conventions:

- Sessions: `sessions/{sessionId}`
- Activities: `sessions/{sessionId}/activities/{activityId}`
- Sources: `sources/{sourceId}`

### Error Handling

The API returns standard HTTP status codes:

| Status | Description                             |
| ------ | --------------------------------------- |
| `200`  | Success                                 |
| `400`  | Bad request - invalid parameters        |
| `401`  | Unauthorized - invalid or missing token |
| `403`  | Forbidden - insufficient permissions    |
| `404`  | Not found - resource doesn't exist      |
| `429`  | Rate limited - too many requests        |
| `500`  | Server error                            |

Error response format:

```json
{
  "error": {
    "code": 400,
    "message": "Invalid session ID format",
    "status": "INVALID_ARGUMENT"
  }
}
```
