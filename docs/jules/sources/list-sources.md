# List Sources

Lists all sources (repositories) connected to your account.

**Endpoint:** `GET /v1alpha/sources`

## Query Parameters

| Parameter   | Type    | Description                                                  |
| ----------- | ------- | ------------------------------------------------------------ |
| `pageSize`  | integer | Number of sources to return (1-100). Default: 30             |
| `pageToken` | string  | Page token from a previous ListSources response              |
| `filter`    | string  | Filter expression (AIP-160). Example: `name=sources/source1` |

## Example Request

```bash
curl -H "x-goog-api-key: $JULES_API_KEY" \
  "https://jules.googleapis.com/v1alpha/sources?pageSize=10"
```

## Response

```json
{
  "sources": [
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
        "branches": [{ "displayName": "main" }, { "displayName": "develop" }, { "displayName": "feature/auth" }]
      }
    }
  ],
  "nextPageToken": "eyJvZmZzZXQiOjEwfQ=="
}
```

## Filtering

Use the `filter` parameter to retrieve specific sources:

```bash
# Get a specific source
curl -H "x-goog-api-key: $JULES_API_KEY" \
  "https://jules.googleapis.com/v1alpha/sources?filter=name%3Dsources%2Fgithub-myorg-myrepo"

# Get multiple sources
curl -H "x-goog-api-key: $JULES_API_KEY" \
  "https://jules.googleapis.com/v1alpha/sources?filter=name%3Dsources%2Fsource1%20OR%20name%3Dsources%2Fsource2"
```
