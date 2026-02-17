# Get a Source

Retrieves a single source by ID.

**Endpoint:** `GET /v1alpha/sources/{sourceId}`

## Path Parameters

| Parameter  | Type   | Description                     |
| ---------- | ------ | ------------------------------- |
| `sourceId` | string | The resource name of the source |

## Example Request

```bash
curl -H "x-goog-api-key: $JULES_API_KEY" \
  https://jules.googleapis.com/v1alpha/sources/github-myorg-myrepo
```

## Response

Returns the full Source object:

```json
{
  "name": "sources/github-myorg-myrepo",
  "id": "github-myorg-myrepo",
  "githubRepo": {
    "owner": "myorg",
    "repo": "myrepo",
    "isPrivate": false,
    "defaultBranch": {
      "displayName": "main"
    },
    "branches": [
      { "displayName": "main" },
      { "displayName": "develop" },
      { "displayName": "feature/auth" },
      { "displayName": "feature/tests" }
    ]
  }
}
```
