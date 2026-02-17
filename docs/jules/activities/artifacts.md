# Artifacts

Activities may include artifacts—outputs produced during execution.

## Code Changes (ChangeSet)

```json
{
  "artifacts": [
    {
      "changeSet": {
        "source": "sources/github-myorg-myrepo",
        "gitPatch": {
          "baseCommitId": "a1b2c3d4e5f6",
          "unidiffPatch": "diff --git a/src/auth.js b/src/auth.js\n...",
          "suggestedCommitMessage": "Add authentication tests"
        }
      }
    }
  ]
}
```

## Bash Output

```json
{
  "artifacts": [
    {
      "bashOutput": {
        "command": "npm test",
        "output": "All tests passed (42 passing)",
        "exitCode": 0
      }
    }
  ]
}
```

## Media

```json
{
  "artifacts": [
    {
      "media": {
        "mimeType": "image/png",
        "data": "base64-encoded-data..."
      }
    }
  ]
}
```
