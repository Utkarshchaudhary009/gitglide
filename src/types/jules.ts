export interface Session {
  name: string
  id: string
  prompt: string
  title?: string
  state: SessionState
  url: string
  sourceContext: SourceContext
  requirePlanApproval: boolean
  automationMode: string
  outputs?: SessionOutput[]
  createTime: string
  updateTime: string
}

export type SessionState =
  | 'STATE_UNSPECIFIED'
  | 'QUEUED'
  | 'PLANNING'
  | 'AWAITING_PLAN_APPROVAL'
  | 'AWAITING_USER_FEEDBACK'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'FAILED'
  | 'COMPLETED'

export interface SourceContext {
  source: string
  githubRepoContext?: {
    startingBranch: string
  }
}

export interface SessionOutput {
  pullRequest?: {
    url: string
    title: string
    description: string
  }
}

export interface Activity {
  name: string
  id: string
  originator: 'user' | 'agent' | 'system'
  description: string
  createTime: string
  artifacts?: any[]
  planGenerated?: any
  planApproved?: any
  userMessaged?: any
  agentMessaged?: any
  progressUpdated?: any
  sessionCompleted?: any
  sessionFailed?: any
}

export interface Source {
  name: string
  id: string
  githubRepo: {
    owner: string
    repo: string
    isPrivate: boolean
    defaultBranch: string
    branches: string[]
  }
}

export interface CreateSessionRequest {
  prompt: string
  title?: string
  sourceContext: SourceContext
  requirePlanApproval?: boolean
  automationMode?: string
}
