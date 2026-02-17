# GitPatch

A patch in Git format.

## Fields

| Field                    | Type   | Description                                  |
| ------------------------ | ------ | -------------------------------------------- |
| `baseCommitId`           | string | The commit ID the patch should be applied to |
| `unidiffPatch`           | string | The patch in unified diff format             |
| `suggestedCommitMessage` | string | A suggested commit message for the patch     |
