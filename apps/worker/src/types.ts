export interface Env {
  MY_CONTAINER: DurableObjectNamespace
  ENVIRONMENT: string
  // KV namespaces
  KV_SESSIONS?: KVNamespace
  KV_USERS?: KVNamespace
  // R2 buckets
  R2_WORKSPACES?: R2Bucket
  // Secrets
  ENCRYPTION_KEY?: string
}

export interface ContainerSession {
  id: string
  userId: string
  workspaceId: string
  apiKey: string
  createdAt: string
  lastAccessedAt: string
  status: 'active' | 'sleeping' | 'terminated'
}

export interface ClaudeCodeRequest {
  prompt: string
  context?: string
  files?: Array<{
    path: string
    content: string
  }>
}

export interface CodeExecutionRequest {
  language: 'javascript' | 'typescript' | 'python'
  code: string
  stdin?: string
}

export interface FileOperation {
  operation: 'read' | 'write' | 'list' | 'mkdir'
  path: string
  content?: string
}

export interface ContainerResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}