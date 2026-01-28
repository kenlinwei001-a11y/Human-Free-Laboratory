export enum ModuleType {
  DASHBOARD = 'dashboard',
  DISCOVERY = 'discovery',
  ANALYSIS = 'analysis',
  RISK = 'risk',
  SIMULATION = 'simulation',
  AI_CONFIG = 'ai_config',
  TASK_DETAIL = 'task_detail',
  NEW_TASK = 'new_task',
  KNOWLEDGE = 'knowledge'
}

export enum DeviceStatus {
  IDLE = '空闲',
  RUNNING = '运行中',
  WAITING = '等待数据',
  ERROR = '异常'
}

export enum RiskLevel {
  LOW = '低',
  MEDIUM = '中',
  HIGH = '高',
  CRITICAL = '极高'
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: DeviceStatus;
  currentTask?: string;
}

export interface PollutantCandidate {
  id: string;
  signalId: string;
  intensity: number;
  frequency: number;
  noveltyScore: number; // 0-100
  riskScore: number; // 0-100
  location: string;
  status: '待分析' | '分析中' | '已确认';
}

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  model: string;
  strategy: 'conservative' | 'balanced' | 'exploratory';
  isEnabled: boolean;
}

export interface ResearchTask {
  id: string;
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  stage: 'sample_prep' | 'nts_screening' | 'structure_id' | 'risk_eval' | 'governance_sim';
  stageLabel: string;
  progress: number; // 0-100
  status: 'running' | 'paused' | 'completed' | 'error' | 'queued';
  startTime: string;
  estimatedEndTime: string;
  owner: string;
}

// Low-Code Workflow Definitions
export interface NodeConfig {
  // Common
  name?: string;
  description?: string;
  
  // Execution Context
  device?: string | string[];          // For physical nodes (Supports Multi-select)
  algorithm?: string | string[];       // For AI nodes (Supports Multi-select)
  modelBase?: string;                  // For AI nodes
  
  // Inputs
  dataSource?: string | string[];      // e.g., 'DB_Water_Quality' (Supports Multi-select)
  inputType?: 'physical_sample' | 'digital_signal' | 'spectrum_file';
  
  // Resources (Physical)
  materials?: {
    name: string;
    amount: string;
    unit: string;
  }[];
  
  // Parameters
  params?: Record<string, string | number | boolean>;
  
  // Outputs
  outputType?: string;
}

export interface WorkflowNode {
  id: string;
  label: string;
  type: 'process' | 'ai_analysis' | 'decision'; // process=physical, ai=digital
  status: 'completed' | 'running' | 'pending' | 'error';
  x: number;
  y: number;
  config: NodeConfig;
  details?: NodeDetail; // Runtime details (optional for builder)
}

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
}

export interface NodeDetail {
  startTime: string;
  endTime?: string;
  inputs: { label: string; value: string }[];
  outputs: { label: string; value: string }[];
  logs: string[];
  metrics?: { label: string; value: string; status: 'normal' | 'warning' }[];
}

export interface Algorithm {
  id: string;
  name: string;
  version: string;
  type: 'screening' | 'structure' | 'risk' | 'prediction';
  source: 'paper' | 'custom' | 'system';
  accuracy: string;
  paperRef?: string;
  description?: string;
  codeSnippet?: string;
  modelArch?: string;
}

export const CHINESE_MODELS = [
  "传神任度大模型 (RenDu)",
  "DeepSeek-V2 (深度求索)",
  "Yi-34B (零一万物)",
  "Qwen-72B (通义千问)",
  "GLM-4 (智谱AI)",
  "Baichuan-2 (百川智能)"
];