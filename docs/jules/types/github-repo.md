# GitHubRepo

A GitHub repository.

## Fields

| Field           | Type           | Description                                 |
| --------------- | -------------- | ------------------------------------------- |
| `owner`         | string         | The repository owner (user or organization) |
| `repo`          | string         | The repository name                         |
| `isPrivate`     | boolean        | Whether the repository is private           |
| `defaultBranch` | GitHubBranch   | The default branch                          |
| `branches`      | GitHubBranch[] | List of active branches                     |
