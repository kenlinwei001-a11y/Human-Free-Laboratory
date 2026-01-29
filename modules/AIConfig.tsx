import React, { useState } from 'react';
import { AgentConfig, CHINESE_MODELS } from '../../types';
import TaskTopology from './TaskTopology';
import { 
  Bot, Cpu, Shield, Save, 
  Settings2, Key, ListFilter,
  Layers, Search, Terminal, Box,
  Play, CheckCircle2, GripVertical, 
  TableProperties, BrainCircuit,
  BookOpen, AlertTriangle, ToggleLeft, ToggleRight,
  Database, FileText, Code, Network, Share2, FileJson, Table,
  Server, HardDrive, RefreshCw, Zap, Activity, Cable, Plug2, X, Eye, Plus,
  ArrowRight, FileDigit, Scan, Eraser, Binary, PenTool, Workflow, CheckSquare,
  FlaskConical, Sliders
} from 'lucide-react';

// --- MOCK DATA ---

const initialAgents: AgentConfig[] = [
  { id: 'a1', name: '新污染物发现智能体', role: 'Discovery', model: 'Qwen-72B', strategy: 'exploratory', isEnabled: true, autoApprove: true, phase: '发现与筛选' },
  { id: 'a2', name: '结构解析智能体', role: 'Analysis', model: 'RenDu-Chem', strategy: 'balanced', isEnabled: true, autoApprove: false, phase: '结构解析' },
  { id: 'a3', name: '风险评估智能体', role: 'Risk', model: 'DeepSeek-V2', strategy: 'conservative', isEnabled: true, autoApprove: false, phase: '风险评估' },
  { id: 'a4', name: '实验调度智能体', role: 'Control', model: 'GLM-4', strategy: 'conservative', isEnabled: true, autoApprove: true, phase: '全流程' },
];

const capabilities = [
  { id: 'c1', name: '高分辨质谱(HRMS)智能去噪', category: '数据清洗', status: 'active', desc: '针对非靶向筛查(NTS)数据，基于深度学习去除基线漂移与化学噪声。' },
  { id: 'c2', name: '新污染物分子结构反演', category: '化学推理', status: 'active', desc: '解析 MS/MS 碎片谱图，反向生成未知污染物的化学结构式 (SMILES)。' },
  { id: 'c3', name: '计算毒理学(QSAR)效应预测', category: '风险评估', status: 'active', desc: '预测化合物的 LC50、内分泌干扰效应及致突变性。' },
  { id: 'c4', name: '多介质环境归趋模拟', category: '过程模拟', status: 'inactive', desc: '基于逸度模型(Fugacity Model)计算污染物在水-气-土-生物相的分布。' },
  { id: 'c5', name: '高通量进样序列智能优化', category: '实验控制', status: 'active', desc: '动态调整进样顺序，最小化交叉污染并优化仪器机时。' },
];

const dataPipelines = [
  { id: 'dp1', name: 'NTS 高分辨质谱数据清洗流水线', type: 'Spectral Processing', status: 'active', tps: '12MB/s', desc: '基于 MZmine 3 内核的去噪、对齐与峰提取流程' },
  { id: 'dp2', name: '环保文献算法自动化抽取流水线', type: 'Knowledge Mining', status: 'active', tps: '5 Papers/min', desc: '从 PDF 文献中识别公式与伪代码并转化为 Python 函数' },
  { id: 'dp3', name: '新污染物理化性质数据挖掘流水线', type: 'Data Extraction', status: 'active', tps: '120 Records/s', desc: '从文献表格与文本中提取 LogKow, LC50 等关键参数' },
  { id: 'dp4', name: 'LIMS-IoT 多源感知数据融合引擎', type: 'Fusion', status: 'active', tps: '450 Ops/s', desc: '实验室 LIMS 数据与在线水质传感器数据的时空对齐' },
];

// Complex Workflow Nodes for Low-Code View
const PIPELINE_WORKFLOWS: Record<string, {id: string, label: string, type: string, desc: string}[]> = {
  'dp1': [
    { id: 'n1', label: '原始 RAW 数据导入', type: 'input', desc: '读取 Thermo/Agilent 原始质谱文件 (.raw, .d)' },
    { id: 'n2', label: '质谱图质控 (QC)', type: 'process', desc: '检查 TIC 总离子流图是否存在断崖式下跌' },
    { id: 'n3', label: '基线校正 (Baseline)', type: 'process', desc: '使用非对称最小二乘平滑算法去除基线漂移' },
    { id: 'n4', label: '噪声过滤 (Denoise)', type: 'process', desc: '小波变换去噪，信噪比阈值设定为 3:1' },
    { id: 'n5', label: '峰提取 (Peak Pick)', type: 'ai', desc: '基于 CentWave 算法提取色谱峰' },
    { id: 'n6', label: '同位素峰识别', type: 'process', desc: '根据 13C/12C 丰度比合并同位素簇' },
    { id: 'n7', label: '加合物归组', type: 'process', desc: '识别 [M+H]+, [M+Na]+ 等常见加合物' },
    { id: 'n8', label: '保留时间对齐', type: 'process', desc: '基于 RANSAC 算法对齐不同批次样品的 RT' },
    { id: 'n9', label: '空白扣除 (Blank)', type: 'filter', desc: '扣除过程空白与溶剂空白中的背景干扰' },
    { id: 'n10', label: '分子式预测', type: 'ai', desc: '基于七条黄金规则计算可能的分子式' },
    { id: 'n11', label: '数据库检索', type: 'db', desc: '匹配 ChemSpider, PubChem 本地镜像库' },
    { id: 'n12', label: '结果导出', type: 'output', desc: '生成 .csv 特征表与 .mgf 碎片文件' },
  ],
  // ... other pipelines omitted for brevity
};

const dataConnectors = [
  { id: 'dc1', name: 'Lab-LIMS Connector', type: 'Database (Oracle)', status: 'active', endpoint: '192.168.1.50:1521', desc: 'Syncs sample registration and basic physicochemical properties.' },
  { id: 'dc2', name: 'IoT Sensor Mesh (MQTT)', type: 'Stream (MQTT)', status: 'active', endpoint: 'mqtt://sensor-hub:1883', desc: 'Real-time temperature, pH, and flow rate monitoring from reactors.' },
  { id: 'dc3', name: 'MassSpec Instrument Interface', type: 'File Watcher', status: 'active', endpoint: '//nas/raw_data/', desc: 'Auto-ingest .raw files from Q-TOF MS upon acquisition completion.' },
  { id: 'dc4', name: 'PubChem API Gateway', type: 'REST API', status: 'paused', endpoint: 'pubchem.ncbi.nlm.nih.gov', desc: 'External chemical structure validation.' },
];

const datasets = [
  { id: 'd1', name: 'NTS Screening Raw Data 2024-Q1', rows: 4500, size: '4.2 GB', type: 'Spectral', updated: '2024-05-15', status: 'Ready' },
  { id: 'd2', name: 'Yangtze River Water Quality Logs', rows: 12050, size: '125 MB', type: 'Tabular', updated: '2024-05-20', status: 'Live' },
  { id: 'd3', name: 'Known Pollutants Fingerprint DB', rows: 850, size: '560 MB', type: 'Reference', updated: '2024-04-01', status: 'Static' },
  { id: 'd4', name: 'ToxCast Bio-Assay Results', rows: 3200, size: '85 MB', type: 'Tabular', updated: '2024-05-10', status: 'Ready' },
];

const mockDatasetContent: Record<string, any[]> = {
  'd1': [
    { id: 'S001', rt: '12.4', mz: '455.12', intensity: 8500, snr: 12.5 },
    { id: 'S002', rt: '14.2', mz: '321.08', intensity: 12400, snr: 45.1 },
    { id: 'S003', rt: '15.1', mz: '566.21', intensity: 6200, snr: 8.2 },
    { id: 'S004', rt: '18.9', mz: '288.15', intensity: 3100, snr: 4.5 },
    { id: 'S005', rt: '22.3', mz: '412.05', intensity: 9800, snr: 18.0 },
    { id: 'S006', rt: '24.1', mz: '601.33', intensity: 2100, snr: 3.2 },
  ],
  // ... other data omitted
};

const llmConfigs = [
  { id: 'm1', name: 'Qwen-72B-Chat (通义千问)', provider: 'Aliyun', status: 'connected', latency: '120ms', context: '32k' },
  { id: 'm2', name: 'DeepSeek-V2 (深度求索)', provider: 'DeepSeek API', status: 'connected', latency: '98ms', context: '128k' },
  { id: 'm3', name: 'RenDu-Chem-Pro (传神任度)', provider: 'Local / Private', status: 'offline', latency: '-', context: '8k' },
  { id: 'm4', name: 'GLM-4 (智谱AI)', provider: 'Zhipu API', status: 'connected', latency: '145ms', context: '128k' },
];

// --- SUB-COMPONENTS ---

const AgentConfigPanel = ({ agents, setAgents, onViewTopology }: { agents: AgentConfig[], setAgents: any, onViewTopology: (id: string) => void }) => {
  const toggleAgent = (id: string) => {
    setAgents((prev: AgentConfig[]) => prev.map(a => a.id === id ? { ...a, isEnabled: !a.isEnabled } : a));
  };
  
  const toggleAuto = (id: string) => {
    setAgents((prev: AgentConfig[]) => prev.map(a => a.id === id ? { ...a, autoApprove: !a.autoApprove } : a));
  };

  return (
    <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
       {agents.map(agent => (
         <div key={agent.id} className={`p-4 rounded-lg border flex flex-col gap-4 transition-all hover:border-blue-500/50 ${agent.isEnabled ? 'bg-slate-800 border-slate-700' : 'bg-slate-800/50 border-slate-700/50 opacity-60'}`}>
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400">
                     <Bot className="w-6 h-6" />
                  </div>
                  <div>
                     <div className="font-bold text-slate-200">{agent.name}</div>
                     <div className="text-xs text-slate-500">{agent.phase} Phase</div>
                  </div>
               </div>
               <button onClick={() => toggleAgent(agent.id)}>
                  {agent.isEnabled ? <ToggleRight className="w-8 h-8 text-green-500" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}
               </button>
            </div>
            
            <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50 text-xs space-y-2">
               <div className="flex justify-between items-center">
                  <span className="text-slate-400">模型基座</span>
                  <select className="bg-slate-800 border-none text-slate-200 text-xs rounded py-0.5 focus:ring-0">
                     {CHINESE_MODELS.map(m => <option key={m}>{m}</option>)}
                  </select>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-slate-400">决策策略</span>
                  <span className={`px-2 py-0.5 rounded border ${
                    agent.strategy === 'exploratory' ? 'text-purple-400 border-purple-500/30' : 'text-blue-400 border-blue-500/30'
                  }`}>{agent.strategy}</span>
               </div>
            </div>

            <div className="mt-auto pt-3 border-t border-slate-700/50 flex items-center justify-between">
               <span className="text-xs text-slate-400 flex items-center gap-1">
                  {agent.autoApprove ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />}
                  {agent.autoApprove ? '允许自动推进' : '需人工确认'}
               </span>
               <div className="flex gap-2">
                  <button onClick={() => toggleAuto(agent.id)} className="text-xs text-slate-400 hover:text-white transition-colors">
                     更改权限
                  </button>
                  <button 
                     onClick={() => onViewTopology(agent.id)}
                     className="flex items-center gap-1 text-xs bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-1 rounded hover:bg-blue-600/40 transition-colors"
                  >
                     <Network className="w-3 h-3" /> 查看作业流
                  </button>
               </div>
            </div>
         </div>
       ))}
    </div>
  );
};

const CapabilityConfig = ({ capability, onBack }: { capability: any, onBack: () => void }) => {
   return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 animate-in fade-in slide-in-from-right duration-300 h-full flex flex-col">
         <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
            <div className="flex items-center gap-4">
               <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
                  <ArrowRight className="w-5 h-5 rotate-180" />
               </button>
               <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                     <Box className="w-5 h-5 text-blue-400" />
                     {capability.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">环境领域专属参数配置</p>
               </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-500 shadow-lg shadow-blue-900/30">
               保存配置
            </button>
         </div>

         <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
            {/* General Settings */}
            <div>
               <h4 className="text-sm font-bold text-slate-300 uppercase mb-4 flex items-center gap-2">
                  <Sliders className="w-4 h-4" /> 核心参数
               </h4>
               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                     <label className="block text-xs text-slate-400 mb-2">算法敏感度 (Sensitivity)</label>
                     <input type="range" className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-2" />
                     <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Low (Conservative)</span>
                        <span>High (Exploratory)</span>
                     </div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                     <label className="block text-xs text-slate-400 mb-2">最大并发线程数</label>
                     <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-slate-200">
                        <option>4 Threads</option>
                        <option>8 Threads</option>
                        <option>16 Threads</option>
                        <option>Auto (GPU)</option>
                     </select>
                  </div>
               </div>
            </div>

            {/* Advanced Settings */}
            <div>
               <h4 className="text-sm font-bold text-slate-300 uppercase mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> 领域模型微调
               </h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded border border-slate-700">
                     <div>
                        <div className="text-sm font-medium text-slate-200">启用背景扣除 (Background Subtraction)</div>
                        <div className="text-xs text-slate-500 mt-1">自动识别并扣除过程空白中的干扰峰</div>
                     </div>
                     <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer bg-green-900/50 border border-green-700">
                        <span className="translate-x-6 inline-block w-6 h-6 transform bg-green-500 rounded-full shadow transition-transform"></span>
                     </div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                     <label className="block text-xs text-slate-400 mb-2">引用数据库优先级</label>
                     <div className="flex gap-2">
                        {['EPA ToxCast', 'ChemSpider', 'PubChem', 'Internal DB'].map(tag => (
                           <span key={tag} className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-600 text-slate-300 hover:border-blue-500 cursor-pointer">
                              {tag}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

const CapabilityPanel = () => {
  const [editingCap, setEditingCap] = useState<any>(null);

  if (editingCap) {
     return <CapabilityConfig capability={editingCap} onBack={() => setEditingCap(null)} />;
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
       <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 px-4 uppercase">
          <div className="col-span-4">能力模块名称</div>
          <div className="col-span-3">分类</div>
          <div className="col-span-3">状态</div>
          <div className="col-span-2 text-right">操作</div>
       </div>
       <div className="space-y-2">
          {capabilities.map(cap => (
             <div key={cap.id} className="grid grid-cols-12 gap-4 items-center bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors">
                <div className="col-span-4">
                   <div className="font-medium text-slate-200">{cap.name}</div>
                   <div className="text-xs text-slate-500 mt-0.5">{cap.desc}</div>
                </div>
                <div className="col-span-3">
                   <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">{cap.category}</span>
                </div>
                <div className="col-span-3">
                   {cap.status === 'active' 
                      ? <span className="text-green-400 text-xs flex items-center gap-1"><Zap className="w-3 h-3"/> 已启用</span> 
                      : <span className="text-slate-500 text-xs">已禁用</span>
                   }
                </div>
                <div className="col-span-2 text-right">
                   <button 
                     onClick={() => setEditingCap(cap)}
                     className="text-blue-400 text-xs hover:text-white border border-blue-500/30 px-3 py-1.5 rounded hover:bg-blue-600 transition-all shadow-sm"
                   >
                      配置
                   </button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

// --- Low Code Workflow Component ---
const PipelineWorkflowDesigner = ({ pipelineId, onBack }: { pipelineId: string, onBack: () => void }) => {
   const pipeline = dataPipelines.find(p => p.id === pipelineId);
   const nodes = PIPELINE_WORKFLOWS[pipelineId] || PIPELINE_WORKFLOWS['dp1']; // Fallback
   const [selectedNode, setSelectedNode] = useState<any>(null);

   return (
      <div className="h-full flex flex-col bg-slate-900 absolute inset-0 z-50 animate-in slide-in-from-right duration-300">
         <div className="h-14 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-800">
            <div className="flex items-center gap-4">
               <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white">
                  <ArrowRight className="w-5 h-5 rotate-180" />
               </button>
               <div>
                  <h3 className="font-bold text-slate-100 flex items-center gap-2">
                     <Workflow className="w-5 h-5 text-blue-400" />
                     {pipeline?.name}
                  </h3>
                  <p className="text-xs text-slate-500">Low-Code Workflow Configuration Mode</p>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-500">保存工作流</button>
            </div>
         </div>

         <div className="flex-1 flex overflow-hidden">
            {/* Canvas */}
            <div className="flex-1 bg-[#0f172a] relative overflow-auto p-10 cursor-grab">
               <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
               
               <div className="flex flex-wrap gap-y-12 gap-x-8 max-w-5xl mx-auto justify-center">
                  {nodes.map((node, index) => (
                     <div key={node.id} className="relative group">
                        <div 
                           onClick={() => setSelectedNode(node)}
                           className={`w-40 p-4 rounded-xl border-2 transition-all cursor-pointer relative z-10 flex flex-col items-center gap-2 shadow-lg hover:-translate-y-1 ${
                              selectedNode?.id === node.id 
                                 ? 'bg-slate-800 border-blue-500 shadow-blue-500/20' 
                                 : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                           }`}
                        >
                           <div className={`p-2 rounded-full ${
                              node.type === 'ai' ? 'bg-purple-500/20 text-purple-400' :
                              node.type === 'input' ? 'bg-green-500/20 text-green-400' :
                              node.type === 'output' ? 'bg-orange-500/20 text-orange-400' :
                              node.type === 'db' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                           }`}>
                              {node.type === 'ai' && <BrainCircuit className="w-5 h-5" />}
                              {node.type === 'input' && <FileDigit className="w-5 h-5" />}
                              {node.type === 'output' && <HardDrive className="w-5 h-5" />}
                              {node.type === 'db' && <Database className="w-5 h-5" />}
                              {node.type === 'process' && <Scan className="w-5 h-5" />}
                              {node.type === 'filter' && <ListFilter className="w-5 h-5" />}
                              {node.type === 'code' && <Code className="w-5 h-5" />}
                              {node.type === 'check' && <CheckSquare className="w-5 h-5" />}
                              {node.type === 'test' && <TestTube className="w-5 h-5" />}
                           </div>
                           <div className="text-center">
                              <div className="text-xs font-bold text-slate-200">{node.label}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5 uppercase">{node.type} NODE</div>
                           </div>
                           
                           {/* Connecting Line (Visual Mock) */}
                           {index < nodes.length - 1 && (
                              <div className="absolute top-1/2 -right-10 w-8 h-0.5 bg-slate-600 z-0"></div>
                           )}
                           {index < nodes.length - 1 && (
                              <div className="absolute top-1/2 -right-10 transform translate-x-1.5 -translate-y-1">
                                 <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-slate-600 border-b-[4px] border-b-transparent"></div>
                              </div>
                           )}
                        </div>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-1 text-[10px] text-slate-600 font-mono z-20">Step {index + 1}</div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Details Panel */}
            <div className="w-80 bg-slate-800 border-l border-slate-700 p-6 flex flex-col">
               <h4 className="text-sm font-bold text-slate-200 mb-6 flex items-center gap-2">
                  <Settings2 className="w-4 h-4" /> 节点配置
               </h4>
               
               {selectedNode ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">节点名称</label>
                        <input type="text" value={selectedNode.label} readOnly className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-slate-200" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">功能描述</label>
                        <textarea readOnly value={selectedNode.desc} className="w-full h-24 bg-slate-900 border border-slate-600 rounded p-2 text-sm text-slate-300 resize-none"></textarea>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">参数配置</label>
                        <div className="bg-slate-900 rounded border border-slate-600 p-2 space-y-2">
                           <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-400">Timeout</span>
                              <span className="text-slate-200">30s</span>
                           </div>
                           <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-400">Retry</span>
                              <span className="text-slate-200">3 times</span>
                           </div>
                           <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-400">Log Level</span>
                              <span className="text-blue-400">DEBUG</span>
                           </div>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center">
                     <Binary className="w-10 h-10 mb-2 opacity-20" />
                     <p className="text-sm">点击左侧节点<br/>查看详细配置</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}

const DataProcessingPanel = () => {
   const [editingPipeline, setEditingPipeline] = useState<string | null>(null);

   if (editingPipeline) {
      return <PipelineWorkflowDesigner pipelineId={editingPipeline} onBack={() => setEditingPipeline(null)} />;
   }

   return (
      <div className="space-y-6 animate-in fade-in duration-300">
         <div className="grid grid-cols-2 gap-4">
             {dataPipelines.map(pipeline => (
                <div key={pipeline.id} className="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-blue-500/50 transition-colors">
                   <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg ${pipeline.status === 'active' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/50 text-slate-400'}`}>
                            <Database className="w-5 h-5" />
                         </div>
                         <div>
                            <div className="font-bold text-slate-200">{pipeline.name}</div>
                            <div className="text-xs text-slate-500">{pipeline.type}</div>
                         </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium border ${
                         pipeline.status === 'active' ? 'bg-green-900/30 text-green-400 border-green-700/50' : 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50'
                      }`}>
                         {pipeline.status === 'active' ? 'RUNNING' : 'PAUSED'}
                      </div>
                   </div>
                   <div className="text-xs text-slate-400 mb-4">{pipeline.desc}</div>
                   <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                         <Activity className="w-3 h-3" /> 吞吐量: <span className="text-slate-300 font-mono">{pipeline.tps}</span>
                      </div>
                      <button 
                        onClick={() => setEditingPipeline(pipeline.id)}
                        className="text-blue-400 hover:text-white text-xs flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 hover:bg-blue-600 hover:border-blue-500 transition-all"
                      >
                         <Settings2 className="w-3 h-3" /> 管理流水线
                      </button>
                   </div>
                </div>
             ))}
         </div>
         
         <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
               <HardDrive className="w-5 h-5 text-purple-400" /> 数据存储与归档策略
            </h3>
            <div className="grid grid-cols-3 gap-6 text-sm">
               <div className="bg-slate-900 p-4 rounded border border-slate-700">
                  <div className="text-slate-500 mb-1">热数据 (Hot)</div>
                  <div className="text-xl font-bold text-slate-200 mb-1">1.2 TB</div>
                  <div className="text-xs text-green-400">Redis / Memcached</div>
               </div>
               <div className="bg-slate-900 p-4 rounded border border-slate-700">
                  <div className="text-slate-500 mb-1">温数据 (Warm)</div>
                  <div className="text-xl font-bold text-slate-200 mb-1">45 TB</div>
                  <div className="text-xs text-blue-400">PostgreSQL / InfluxDB</div>
               </div>
               <div className="bg-slate-900 p-4 rounded border border-slate-700">
                  <div className="text-slate-500 mb-1">冷数据 (Cold)</div>
                  <div className="text-xl font-bold text-slate-200 mb-1">1.8 PB</div>
                  <div className="text-xs text-purple-400">OSS Archive</div>
               </div>
            </div>
         </div>
      </div>
   )
}

const DataConnectorPanel = () => {
   return (
      <div className="space-y-6 animate-in fade-in duration-300">
         <div className="grid grid-cols-2 gap-4">
             {dataConnectors.map(conn => (
                <div key={conn.id} className="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-blue-500/50 transition-colors group">
                   <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg ${conn.status === 'active' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/50 text-slate-400'}`}>
                            <Cable className="w-5 h-5" />
                         </div>
                         <div>
                            <div className="font-bold text-slate-200">{conn.name}</div>
                            <div className="text-xs text-slate-500">{conn.type}</div>
                         </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium border ${
                         conn.status === 'active' ? 'bg-green-900/30 text-green-400 border-green-700/50' : 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50'
                      }`}>
                         {conn.status === 'active' ? 'CONNECTED' : 'PAUSED'}
                      </div>
                   </div>
                   <div className="text-xs text-slate-400 mb-4 h-8">{conn.desc}</div>
                   <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 bg-slate-900/20 -mx-5 -mb-5 px-5 py-3 mt-auto">
                      <div className="text-xs text-slate-500 font-mono truncate max-w-[150px]">
                         {conn.endpoint}
                      </div>
                      <button className="text-blue-400 hover:text-white text-xs border border-blue-500/30 px-3 py-1.5 rounded hover:bg-blue-500/20 flex items-center gap-1">
                         <Settings2 className="w-3 h-3" /> 配置
                      </button>
                   </div>
                </div>
             ))}
             
             {/* Add New Connector */}
             <button className="border-2 border-dashed border-slate-700 rounded-lg p-5 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-400 transition-colors min-h-[160px]">
                <Plug2 className="w-8 h-8 mb-2 opacity-50" />
                <span className="font-medium text-sm">添加数据连接器</span>
                <span className="text-xs mt-1">支持 SQL, MQTT, REST, FTP</span>
             </button>
         </div>
      </div>
   )
}

const DatasetPanel = () => {
   const [selectedDataset, setSelectedDataset] = useState<string | null>(null);

   const openDataset = (id: string) => {
      setSelectedDataset(id);
   };

   return (
      <div className="h-full flex flex-col animate-in fade-in duration-300">
         {selectedDataset ? (
            <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col">
               <div className="h-14 border-b border-slate-700 bg-slate-800 px-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="p-2 bg-blue-600 rounded-lg">
                        <Table className="w-4 h-4 text-white" />
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-100">{datasets.find(d => d.id === selectedDataset)?.name}</h3>
                        <div className="text-xs text-slate-400 flex gap-3">
                           <span>ID: {selectedDataset}</span>
                           <span>|</span>
                           <span>Type: {datasets.find(d => d.id === selectedDataset)?.type}</span>
                        </div>
                     </div>
                  </div>
                  <button onClick={() => setSelectedDataset(null)} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
                     <X className="w-6 h-6" />
                  </button>
               </div>
               
               <div className="flex-1 overflow-auto p-6">
                  <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                     <div className="p-3 bg-slate-900/50 border-b border-slate-700 flex justify-between">
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider pt-1">Data Preview (First 50 rows)</span>
                        <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                           <RefreshCw className="w-3 h-3" /> 刷新数据
                        </button>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                           <thead className="bg-slate-900 text-slate-400 text-xs uppercase">
                              <tr>
                                 {mockDatasetContent[selectedDataset] && Object.keys(mockDatasetContent[selectedDataset][0]).map(key => (
                                    <th key={key} className="px-6 py-3 font-medium border-b border-slate-700">{key}</th>
                                 ))}
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-700/50">
                              {mockDatasetContent[selectedDataset] ? mockDatasetContent[selectedDataset].map((row, idx) => (
                                 <tr key={idx} className="hover:bg-slate-700/30">
                                    {Object.values(row).map((val: any, i) => (
                                       <td key={i} className="px-6 py-3 text-slate-300 font-mono text-xs">{val}</td>
                                    ))}
                                 </tr>
                              )) : (
                                 <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                       No preview data available for this dataset.
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>
         ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {datasets.map(ds => (
                  <div key={ds.id} onClick={() => openDataset(ds.id)} className="bg-slate-800 border border-slate-700 rounded-lg p-5 cursor-pointer hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/20 transition-all group flex flex-col h-[180px]">
                     <div className="flex justify-between items-start mb-3">
                        <div className="p-2.5 bg-slate-700/50 rounded-lg text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                           <TableProperties className="w-5 h-5" />
                        </div>
                        <div className={`text-[10px] px-2 py-0.5 rounded border ${
                           ds.status === 'Live' ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-slate-400 border-slate-600 bg-slate-700/30'
                        }`}>
                           {ds.status}
                        </div>
                     </div>
                     <h4 className="font-bold text-slate-200 text-sm line-clamp-2 mb-2 group-hover:text-blue-300 transition-colors">{ds.name}</h4>
                     
                     <div className="mt-auto space-y-1.5 pt-3 border-t border-slate-700/50 text-xs text-slate-400">
                        <div className="flex justify-between">
                           <span>Rows:</span>
                           <span className="font-mono text-slate-300">{ds.rows.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                           <span>Size:</span>
                           <span className="font-mono text-slate-300">{ds.size}</span>
                        </div>
                        <div className="flex justify-between">
                           <span>Updated:</span>
                           <span>{ds.updated}</span>
                        </div>
                     </div>
                  </div>
               ))}
               
               {/* Add Dataset Card */}
               <div className="border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-400 transition-colors cursor-pointer h-[180px]">
                   <Plus className="w-8 h-8 mb-2 opacity-50" />
                   <span className="font-medium text-sm">注册数据集</span>
               </div>
            </div>
         )}
      </div>
   )
}

const ModelConfigPanel = () => {
   return (
      <div className="animate-in fade-in duration-300 space-y-6">
         <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
             <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-slate-200 flex items-center gap-2">
                   <BrainCircuit className="w-5 h-5 text-green-400" /> 已接入大模型 (LLM Registry)
                </h3>
                <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-500 flex items-center gap-1">
                   <RefreshCw className="w-3 h-3" /> 刷新状态
                </button>
             </div>
             <div className="p-0">
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                      <tr>
                         <th className="p-4 font-medium">模型名称</th>
                         <th className="p-4 font-medium">供应商</th>
                         <th className="p-4 font-medium">上下文窗口</th>
                         <th className="p-4 font-medium">延迟</th>
                         <th className="p-4 font-medium">状态</th>
                         <th className="p-4 font-medium text-right">配置</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-700/50">
                      {llmConfigs.map(model => (
                         <tr key={model.id} className="hover:bg-slate-700/20 transition-colors">
                            <td className="p-4 font-medium text-slate-200">{model.name}</td>
                            <td className="p-4 text-slate-400">{model.provider}</td>
                            <td className="p-4 text-slate-300 font-mono">{model.context}</td>
                            <td className="p-4 text-slate-300 font-mono">{model.latency}</td>
                            <td className="p-4">
                               {model.status === 'connected' ? (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-green-900/30 text-green-400 border border-green-700/50">
                                     <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Connected
                                  </span>
                               ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-400 border border-slate-600">
                                     <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Offline
                                  </span>
                               )}
                            </td>
                            <td className="p-4 text-right">
                               <button className="text-blue-400 hover:text-white text-xs border border-blue-500/30 px-3 py-1 rounded hover:bg-blue-600/20">
                                  <Settings2 className="w-3.5 h-3.5" />
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
         </div>

         <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
               <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Key className="w-4 h-4 text-yellow-400" /> API 密钥管理
               </h3>
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs text-slate-400 mb-1">DeepSeek API Key</label>
                     <div className="flex gap-2">
                        <input type="password" value="sk-xxxxxxxxxxxxxxxx" readOnly className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-xs text-slate-400 font-mono" />
                        <button className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded">更新</button>
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs text-slate-400 mb-1">Aliyun DashScope Key</label>
                     <div className="flex gap-2">
                        <input type="password" value="sk-yyyyyyyyyyyyyyyy" readOnly className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-xs text-slate-400 font-mono" />
                        <button className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded">更新</button>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
               <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-blue-400" /> 全局推理参数默认值
               </h3>
               <div className="space-y-4">
                  <div>
                     <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Temperature</span>
                        <span>0.7</span>
                     </div>
                     <input type="range" className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500" value="70" readOnly />
                  </div>
                  <div>
                     <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Top P</span>
                        <span>0.9</span>
                     </div>
                     <input type="range" className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500" value="90" readOnly />
                  </div>
                  <div>
                     <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Max Tokens</span>
                        <span>4096</span>
                     </div>
                     <input type="range" className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500" value="50" readOnly />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

// --- Main Component ---

const AIConfigCorrected: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agents' | 'capabilities' | 'pipelines' | 'connectors' | 'datasets' | 'models'>('pipelines');
  const [agents, setAgents] = useState<AgentConfig[]>(initialAgents);
  const [showTopology, setShowTopology] = useState(false);

  const handleViewTopology = (id: string) => {
    setShowTopology(true);
  };

  if (showTopology) {
     return <TaskTopology onBack={() => setShowTopology(false)} />;
  }

  const tabs = [
    { id: 'pipelines', label: '数据流水线', icon: Activity },
    { id: 'connectors', label: '数据连接器', icon: Cable },
    { id: 'datasets', label: '数据集管理', icon: Database },
    { id: 'agents', label: '智能体配置', icon: Bot },
    { id: 'capabilities', label: '能力模块', icon: Box },
    { id: 'models', label: '大模型配置', icon: Server },
  ];

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-500" />
            AI 基础设施与中台配置
          </h2>
          <p className="text-sm text-slate-400">管理智能体职责、数据流水线连接及底层大模型参数。</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium transition-colors shadow-lg shadow-blue-900/50">
           <Save className="w-4 h-4" /> 保存全局配置
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 mb-6 shrink-0 overflow-x-auto">
         {tabs.map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
               activeTab === tab.id 
                 ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                 : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
             }`}
           >
             <tab.icon className="w-4 h-4" />
             {tab.label}
           </button>
         ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900/30 rounded-lg p-1 relative">
         {activeTab === 'pipelines' && <DataProcessingPanel />}
         {activeTab === 'connectors' && <DataConnectorPanel />}
         {activeTab === 'datasets' && <DatasetPanel />}
         {activeTab === 'agents' && <AgentConfigPanel agents={agents} setAgents={setAgents} onViewTopology={handleViewTopology} />}
         {activeTab === 'capabilities' && <CapabilityPanel />}
         {activeTab === 'models' && <ModelConfigPanel />}
      </div>
    </div>
  );
};

export default AIConfigCorrected;
// Add TestTube to imports
function TestTube(props: any) {
  return <FlaskConical {...props} />
}