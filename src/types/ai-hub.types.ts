export enum AiAgentType {
  CRM_ASSISTANT = 'CRM_ASSISTANT',
  DEERFLOW = 'DEERFLOW',
  HERMES = 'HERMES',
}

export enum AgentStatus {
  ONLINE = 'ONLINE',
  THINKING = 'THINKING',
  EXECUTING = 'EXECUTING',
  OFFLINE = 'OFFLINE',
}

export interface ExecutionStep {
  stepIndex: number;
  name: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETE' | 'FAILED';
  durationMs?: number;
  logs?: string;
  inputJson?: any;
  outputJson?: any;
}

export interface ToolCallLog {
  id: string;
  toolName: string;
  description: string;
  status: 'RUNNING' | 'COMPLETE' | 'FAILED';
  durationMs?: number;
  inputParams?: any;
  outputSummary?: any;
  logs?: string;
}

export interface KnowledgeDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: 'INDEXING' | 'READY' | 'ERROR';
  uploadDate: string;
}

export interface MemoryItem {
  id: string;
  key: string;
  value: string;
  pinned: boolean;
  category: 'PREFERENCE' | 'CONTEXT' | 'CUSTOMER' | 'OTHER';
  updatedAt: string;
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agentType?: AiAgentType;
  executionSteps?: ExecutionStep[];
  toolCalls?: ToolCallLog[];
  createdAt: string;
}

export interface AiConversation {
  id: string;
  title: string;
  agentType: AiAgentType;
  contextEntityId?: string;
  contextEntityType?: 'LEAD' | 'OPPORTUNITY' | 'CONTRACT' | 'CUSTOMER';
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AiUsageMetrics {
  totalRequests: number;
  successRate: number;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  avgLatencyMs: number;
  estimatedCostUsd: number;
}
