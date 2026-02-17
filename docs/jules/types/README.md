# Types Reference

This page documents all data types used in the Jules REST API.

## Core Resources

| Type                                 | Description                                       |
| ------------------------------------ | ------------------------------------------------- |
| [Session](session.md)                | A unit of work where Jules executes a coding task |
| [SessionState](session-state.md)     | Current state of a session                        |
| [AutomationMode](automation-mode.md) | Automation settings for a session                 |
| [Activity](activity.md)              | A single event within a session                   |
| [Source](source.md)                  | A connected repository                            |

## Plans

| Type                     | Description             |
| ------------------------ | ----------------------- |
| [Plan](plan.md)          | A sequence of steps     |
| [PlanStep](plan-step.md) | A single step in a plan |

## Artifacts

| Type                         | Description                  |
| ---------------------------- | ---------------------------- |
| [Artifact](artifact.md)      | Data produced by an activity |
| [ChangeSet](change-set.md)   | Code changes                 |
| [GitPatch](git-patch.md)     | Patch in Git format          |
| [BashOutput](bash-output.md) | Command output               |
| [Media](media.md)            | Media file output            |

## GitHub Types

| Type                                        | Description              |
| ------------------------------------------- | ------------------------ |
| [GitHubRepo](github-repo.md)                | A GitHub repository      |
| [GitHubBranch](github-branch.md)            | A GitHub branch          |
| [GitHubRepoContext](github-repo-context.md) | Context for GitHub repos |

## Context Types

| Type                               | Description                |
| ---------------------------------- | -------------------------- |
| [SourceContext](source-context.md) | Context for using a source |

## Output Types

| Type                               | Description         |
| ---------------------------------- | ------------------- |
| [SessionOutput](session-output.md) | Output of a session |
| [PullRequest](pull-request.md)     | A pull request      |

## Activity Event Types

| Type                                     | Description          |
| ---------------------------------------- | -------------------- |
| [PlanGenerated](plan-generated.md)       | A plan was generated |
| [PlanApproved](plan-approved.md)         | A plan was approved  |
| [UserMessaged](user-messaged.md)         | User message         |
| [AgentMessaged](agent-messaged.md)       | Agent message        |
| [ProgressUpdated](progress-updated.md)   | Progress update      |
| [SessionCompleted](session-completed.md) | Session completed    |
| [SessionFailed](session-failed.md)       | Session failed       |

## Request/Response Types

| Type                                                  | Description              |
| ----------------------------------------------------- | ------------------------ |
| [SendMessageRequest](send-message-request.md)         | Send message request     |
| [SendMessageResponse](send-message-response.md)       | Send message response    |
| [ApprovePlanRequest](approve-plan-request.md)         | Approve plan request     |
| [ApprovePlanResponse](approve-plan-response.md)       | Approve plan response    |
| [ListSessionsResponse](list-sessions-response.md)     | List sessions response   |
| [ListActivitiesResponse](list-activities-response.md) | List activities response |
| [ListSourcesResponse](list-sources-response.md)       | List sources response    |
