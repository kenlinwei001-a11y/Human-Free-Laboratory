export enum ModuleType {
  TASK_MANAGE = 'task_manage',         // 1. 任务与目标管理
  DASHBOARD = 'dashboard',             // 2. 数据与实验态势总览
  DISCOVERY = 'discovery',             // 3. 新污染物发现与筛选
  ANALYSIS = 'analysis',               // 4. 结构解析与机理推演
  RISK = 'risk',                       // 5. 风险评估与决策支持
  SIMULATION = 'simulation',           // 6. 治理实验仿真与对比
  
  AI_CONFIG = 'ai_config',             // 8. 智能配置 (Infrastructure)
  
  TASK_DETAIL = 'task_detail',         // Sub-view: Topology
  KNOWLEDGE = 'knowledge'              // Sub-view: Knowledge Base (merged into AI Config or separate)
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
  autoApprove?: boolean; // New: Auto-advance permission
  phase?: string; // New: Research Phase
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
  name?: string;
  description?: string;
  device?: string | string[];
  algorithm?: string | string[];
  modelBase?: string;
  dataSource?: string | string[];
  inputType?: 'physical_sample' | 'digital_signal' | 'spectrum_file';
  materials?: {
    name: string;
    amount: string;
    unit: string;
  }[];
  params?: Record<string, string | number | boolean>;
  outputType?: string;
}

export interface WorkflowNode {
  id: string;
  label: string;
  type: 'process' | 'ai_analysis' | 'decision'; 
  status: 'completed' | 'running' | 'pending' | 'error';
  x: number;
  y: number;
  config: NodeConfig;
  details?: NodeDetail;
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