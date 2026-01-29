import React, { useState } from 'react';
import { AgentConfig, CHINESE_MODELS } from '../../types';
import { 
  Bot, Cpu, GitBranch, Shield, Save, Database, 
  Network, Workflow, Zap, Server, 
  Settings2, Code, Key, Plug, RefreshCw, 
  Layers, Search, Terminal, Box,
  Play, FileJson, Table, ArrowRight,
  FileCode, Sparkles, Share2, MousePointer2,
  CheckCircle2, Plus, GripVertical, Building2,
  FileText, Regex, Eye, BarChart3, ListFilter,
  ArrowDownToLine, HardDrive, Braces
} from 'lucide-react';

// --- Mock Data: Agents ---
const initialAgents: AgentConfig[] = [
  { id: 'agent-1', name: '新污染物发现智能体', role: '发现与初筛', model: 'Qwen-72B (通义千问)', strategy: 'exploratory', isEnabled: true },
  { id: 'agent-2', name: '结构解析智能体', role: '分子结构推断', model: '传神任度大模型 (RenDu)', strategy: 'balanced', isEnabled: true },
  { id: 'agent-3', name: '风险评估智能体', role: '多维风险计算', model: 'DeepSeek-V2 (深度求索)', strategy: 'conservative', isEnabled: true },
  { id: 'agent-4', name: '实验调度智能体', role: '设备资源排期', model: 'GLM-4 (智谱AI)', strategy: 'conservative', isEnabled: false },
];

// --- Mock Data: Connectors (Expanded) ---
const connectors = [
  { id: 'conn-1', name: 'Lab-LIMS 核心库', type: 'PostgreSQL', status: 'connected', latency: '12ms', lastSync: '1 分钟前', icon: Database },
  { id: 'conn-2', name: '仪器 IoT 消息总线', type: 'MQTT/Kafka', status: 'connected', latency: '4ms', lastSync: '实时', icon: Zap },
  { id: 'conn-5', name: 'SAP S/4HANA (物资)', type: 'OData / RFC', status: 'connected', latency: '150ms', lastSync: '1 小时前', icon: Box },
  { id: 'conn-6', name: '企业 OA (泛微/钉钉)', type: 'API Gateway / Webhook', status: 'connected', latency: '35ms', lastSync: '实时', icon: Building2 },
  { id: 'conn-3', name: 'PubChem 镜像库', type: 'REST API', status: 'error', latency: '-', lastSync: '2 天前', icon: Network },
  { id: 'conn-4', name: '原始质谱数据存储', type: 'S3 / MinIO', status: 'connected', latency: '45ms', lastSync: '10 分钟前', icon: Server },
];

// --- Mock Data: MCP Tools (Updated & Localized) ---
const mcpTools = [
  { id: 't1', name: 'retrieve_spectrum_library', displayName: '检索标准质谱库', type: '数据检索', desc: '根据母离子 m/z 和保留时间窗口检索内部标准品库，返回匹配度最高的候选物列表。', schema: '{"mz": "number", "rt_window": "number", "top_k": "integer"}', permission: 'Read-Only' },
  { id: 't2', name: 'control_robotic_arm', displayName: '控制机械臂移动', type: '设备控制', desc: '控制样品前处理机械臂将样品盘从指定位置移动到目标位置。', schema: '{"source_slot": "string", "target_slot": "string", "speed": "enum[slow,fast]"}', permission: 'Admin' },
  { id: 't3', name: 'run_toxicity_prediction', displayName: '运行毒性预测模型', type: '计算分析', desc: '调用本地 Python 环境中的 QSAR 模型，基于 SMILES 预测 LC50 毒性值。', schema: '{"smiles": "string", "model_version": "string"}', permission: 'Execute' },
  { id: 't4', name: 'query_lims_sample_status', displayName: '查询 LIMS 样本状态', type: '系统集成', desc: '查询实验室信息管理系统中特定样本ID的流转状态和元数据。', schema: '{"sample_id": "string"}', permission: 'Read-Only' },
  { id: 't5', name: 'search_knowledge_graph', displayName: '检索知识图谱', type: '知识查询', desc: '通过 Cypher 语句查询新污染物知识图谱，获取化合物关联的文献和法规信息。', schema: '{"entity_name": "string", "relation_type": "string"}', permission: 'Read-Only' },
  { id: 't6', name: 'adjust_hplc_params', displayName: '调节 HPLC 参数', type: '设备控制', desc: '动态调整液相色谱的流速、柱温箱温度或流动相配比。', schema: '{"flow_rate": "float", "temperature": "float", "solvent_ratio": "object"}', permission: 'Admin' },
  { id: 't7', name: 'generate_experiment_report', displayName: '生成实验报告', type: '文档处理', desc: '基于模板 ID 和实验数据 ID，自动生成 PDF 格式的实验总结报告。', schema: '{"template_id": "string", "data_ids": "array<string>"}', permission: 'Write' },
];

// --- Types for Pipeline Builder ---
interface PipelineNode {
  id: string;
  type: 'source' | 'transform' | 'code' | 'sink' | 'model';
  label: string;
  status: 'ready' | 'processing' | 'error';
  x: number;
  y: number;
  desc?: string;
}

const initialPipelineNodes: PipelineNode[] = [
  { id: 'n1', type: 'source', label: 'S3: 原始 PDF 文献集', status: 'ready', x: 50, y: 100, desc: '连接到 minIO 存储桶 "raw-papers-2024"' },
  { id: 'n2', type: 'transform', label: 'OCR 与元数据提取', status: 'ready', x: 280, y: 100, desc: 'PaddleOCR v4 + 正则表达式提取' },
  { id: 'n3', type: 'code', label: '文本分块 (Python)', status: 'ready', x: 510, y: 100, desc: 'LangChain RecursiveSplitter' },
  { id: 'n4', type: 'model', label: 'BGE-M3 向量化', status: 'processing', x: 740, y: 100, desc: 'BAAI General Embedding' },
  { id: 'n5', type: 'sink', label: 'Milvus 向量库写入', status: 'ready', x: 970, y: 100, desc: 'Collection: pollutant_knowledge' },
];

// --- Sub-Components ---

const AgentOrchestration = ({ agents, setAgents }: { agents: AgentConfig[], setAgents: any }) => {
  const handleModelChange = (id: string, newModel: string) => {
    setAgents((prev: AgentConfig[]) => prev.map(agent => agent.id === id ? { ...agent, model: newModel } : agent));
  };
  
  const toggleAgent = (id: string) => {
    setAgents((prev: AgentConfig[]) => prev.map(agent => agent.id === id ? { ...agent, isEnabled: !agent.isEnabled } : agent));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className={`border rounded-lg p-5 transition-all ${agent.isEnabled ? 'bg-slate-800 border-slate-700' : 'bg-slate-900 border-slate-800 opacity-70'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${agent.isEnabled ? 'bg-blue-900 text-blue-300' : 'bg-slate-800 text-slate-500'}`}>
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">{agent.name}</h3>
                  <div className="text-xs text-slate-400">{agent.role}</div>
                </div>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-slate-700 cursor-pointer" onClick={() => toggleAgent(agent.id)}>
                 <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${agent.isEnabled ? 'translate-x-6 bg-green-500' : 'bg-slate-500'}`}></div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold mb-1.5 flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> 模型基座
                </label>
                <select 
                  disabled={!agent.isEnabled}
                  value={agent.model}
                  onChange={(e) => handleModelChange(agent.id, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded px-3 py-2 outline-none focus:border-blue-500 disabled:opacity-50"
                >
                  {CHINESE_MODELS.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
                {agent.model.includes('RenDu') && (
                  <div className="text-[10px] text-purple-400 mt-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    已启用化学领域专用增强 (Transsion RenDu)
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold mb-1.5 flex items-center gap-1">
                  <GitBranch className="w-3 h-3" /> 决策偏好
                </label>
                <div className="flex gap-2">
                   <div className={`text-xs px-3 py-1.5 rounded border capitalize flex-1 text-center ${agent.strategy === 'conservative' ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>保守严谨</div>
                   <div className={`text-xs px-3 py-1.5 rounded border capitalize flex-1 text-center ${agent.strategy === 'balanced' ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>平衡</div>
                   <div className={`text-xs px-3 py-1.5 rounded border capitalize flex-1 text-center ${agent.strategy === 'exploratory' ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>探索创新</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DataConnectors = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-end mb-4">
          <p className="text-sm text-slate-400">管理实验室异构数据源连接，包含 LIMS、IoT、ERP (SAP) 及 OA 审批流系统。</p>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm transition-colors">
            <Plug className="w-4 h-4" /> 新增数据源连接
          </button>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectors.map(conn => (
            <div key={conn.id} className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col hover:border-blue-500/50 transition-colors group">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-slate-300 group-hover:bg-blue-900/30 group-hover:text-blue-400 transition-colors">
                        <conn.icon className="w-5 h-5" />
                     </div>
                     <div>
                        <div className="font-semibold text-slate-200">{conn.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{conn.type}</div>
                     </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                    conn.status === 'connected' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}>
                     {conn.status}
                  </div>
               </div>
               
               <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                  <div>
                     <div className="text-[10px] text-slate-500 uppercase">网络延迟</div>
                     <div className="text-sm font-mono text-slate-300">{conn.latency}</div>
                  </div>
                  <div>
                     <div className="text-[10px] text-slate-500 uppercase">上次同步</div>
                     <div className="text-sm font-mono text-slate-300 flex items-center gap-1">
                        {conn.lastSync}
                        {conn.status === 'connected' && <RefreshCw className="w-3 h-3 text-slate-600 hover:text-blue-400 cursor-pointer" />}
                     </div>
                  </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

// --- Data Pipeline Builder (Enhanced Palantir Style) ---
const DataPipelineBuilder = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('n3');
  
  const selectedNode = initialPipelineNodes.find(n => n.id === selectedNodeId);

  // --- Configuration Panel Renderers ---

  // 1. Source Node Config (File List & Connection)
  const renderSourceConfig = () => (
     <div className="flex flex-col h-full space-y-5">
        <div className="bg-slate-900/50 p-3 rounded border border-slate-700 flex items-center justify-between">
           <div>
              <div className="text-[10px] text-slate-500 uppercase">Connection Status</div>
              <div className="text-sm font-medium text-green-400 flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div> Connected
              </div>
           </div>
           <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase">Bucket</div>
              <div className="text-sm font-mono text-slate-300">s3://raw-papers-2024</div>
           </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
           <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><FileText className="w-3.5 h-3.5"/> 待处理文件列表</span>
              <button className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"><RefreshCw className="w-3 h-3"/> 刷新</button>
           </div>
           <div className="border border-slate-700 rounded-lg overflow-hidden flex-1 bg-slate-950">
              <table className="w-full text-left text-[11px]">
                 <thead className="bg-slate-900 text-slate-500 font-semibold">
                    <tr>
                       <th className="p-2 border-b border-slate-800">File Name</th>
                       <th className="p-2 border-b border-slate-800">Size</th>
                       <th className="p-2 border-b border-slate-800">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800 text-slate-300">
                    {[
                       { name: 'PFAS_Toxicity_Review_2024.pdf', size: '2.4 MB', status: 'Pending' },
                       { name: 'Yangtze_River_Survey_Q1.pdf', size: '1.8 MB', status: 'Pending' },
                       { name: 'New_Method_GB_5749.pdf', size: '4.2 MB', status: 'Ready' },
                       { name: 'Lab_Report_X09_Final.pdf', size: '0.9 MB', status: 'Ready' },
                       { name: 'Supp_Data_Analysis.xlsx', size: '5.1 MB', status: 'Error' },
                    ].map((file, i) => (
                       <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-2 truncate max-w-[120px]" title={file.name}>{file.name}</td>
                          <td className="p-2 font-mono text-slate-500">{file.size}</td>
                          <td className="p-2">
                             <span className={`px-1.5 py-0.5 rounded border ${
                                file.status === 'Ready' ? 'text-green-400 border-green-900 bg-green-900/20' :
                                file.status === 'Pending' ? 'text-blue-400 border-blue-900 bg-blue-900/20' :
                                'text-red-400 border-red-900 bg-red-900/20'
                             }`}>{file.status}</span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
        
        <div className="bg-blue-900/20 p-3 rounded border border-blue-800/50">
           <div className="flex items-center gap-2 text-blue-300 text-xs font-bold mb-1"><Eye className="w-3 h-3" /> Preview</div>
           <p className="text-[10px] text-blue-200/70 leading-relaxed">
              Selected source contains unstructured PDF documents and Excel supplements. Default parser will apply auto-detection for encoding.
           </p>
        </div>
     </div>
  );

  // 2. Transform Node Config (OCR & Rules)
  const renderTransformConfig = () => (
     <div className="flex flex-col h-full space-y-5">
        <div className="space-y-3">
           <label className="text-xs font-bold text-slate-400 block">OCR 引擎配置</label>
           <select className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200">
              <option>PaddleOCR v4 (Recommended)</option>
              <option>Tesseract 5.0 (LSTM)</option>
              <option>Google Vision API (Cloud)</option>
           </select>
           <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Confidence Threshold</span>
              <span className="text-slate-200">0.85</span>
           </div>
           <input type="range" className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
        </div>

        <div className="flex-1 flex flex-col min-h-0">
           <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><Regex className="w-3.5 h-3.5"/> 元数据提取规则 (Regex)</span>
              <Plus className="w-3.5 h-3.5 text-blue-400 cursor-pointer hover:text-white" />
           </div>
           <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar">
              {[
                 { label: 'CAS Number', pattern: '\\b\\d{2,7}-\\d{2}-\\d\\b' },
                 { label: 'Chemical Formula', pattern: 'C\\d{1,3}H\\d{1,3}[A-Z][a-z]?\\d*' },
                 { label: 'DOI', pattern: '10.\\d{4,9}/[-._;()/:a-zA-Z0-9]+' },
                 { label: 'Date', pattern: '\\d{4}-\\d{2}-\\d{2}' },
              ].map((rule, i) => (
                 <div key={i} className="bg-slate-950 p-2 rounded border border-slate-800 flex flex-col gap-1 group hover:border-slate-600 transition-colors">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] text-blue-300 font-medium bg-blue-900/20 px-1.5 rounded">{rule.label}</span>
                       <Eye className="w-3 h-3 text-slate-600 hover:text-slate-300 cursor-pointer" />
                    </div>
                    <code className="text-[10px] font-mono text-green-400">{rule.pattern}</code>
                 </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
           <div className="bg-slate-900 p-2 rounded border border-slate-700">
              <div className="text-[10px] text-slate-500 uppercase mb-1">Input Fields</div>
              <div className="text-xs text-slate-300">raw_content, filename</div>
           </div>
           <div className="bg-slate-900 p-2 rounded border border-slate-700">
              <div className="text-[10px] text-slate-500 uppercase mb-1">Output Fields</div>
              <div className="text-xs text-slate-300">text, meta_json, date</div>
           </div>
        </div>
     </div>
  );

  // 3. Code Node Config (Python Editor)
  const renderCodeConfig = () => (
     <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-2 shrink-0">
           <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-bold text-slate-200">Python Transformation</span>
           </div>
           <span className="text-[10px] font-mono text-slate-500">Runtime: Python 3.9</span>
        </div>
        
        <div className="flex-1 bg-[#0d1117] border border-slate-700 rounded-t p-3 font-mono text-xs text-slate-300 overflow-auto custom-scrollbar">
           <div className="text-slate-500 italic mb-2"># Import dependencies</div>
           <div><span className="text-purple-400">from</span> langchain.text_splitter <span className="text-purple-400">import</span> RecursiveCharacterTextSplitter</div>
           <br/>
           <div><span className="text-purple-400">def</span> <span className="text-yellow-200">transform_chunk</span>(doc):</div>
           <div className="pl-4"><span className="text-slate-500"># Configure splitter parameters</span></div>
           <div className="pl-4">splitter = RecursiveCharacterTextSplitter(</div>
           <div className="pl-8">chunk_size=<span className="text-orange-300">512</span>,</div>
           <div className="pl-8">chunk_overlap=<span className="text-orange-300">50</span>,</div>
           <div className="pl-8">separators=[<span className="text-green-300">"\n\n"</span>, <span className="text-green-300">"\n"</span>, <span className="text-green-300">" "</span>]</div>
           <div className="pl-4">)</div>
           <br/>
           <div className="pl-4"><span className="text-slate-500"># Execute split</span></div>
           <div className="pl-4">chunks = splitter.split_text(doc.get(<span className="text-green-300">'text'</span>, <span className="text-green-300">''</span>))</div>
           <br/>
           <div className="pl-4"><span className="text-purple-400">return</span> [{</div>
           <div className="pl-8"><span className="text-green-300">'chunk_id'</span>: <span className="text-blue-300">f"</span><span className="text-blue-300">{`{doc['id']}_{i}`}</span><span className="text-blue-300">"</span>,</div>
           <div className="pl-8"><span className="text-green-300">'content'</span>: c,</div>
           <div className="pl-8"><span className="text-green-300">'meta'</span>: doc.get(<span className="text-green-300">'meta_json'</span>)</div>
           <div className="pl-4">} <span className="text-purple-400">for</span> i, c <span className="text-purple-400">in</span> enumerate(chunks)]</div>
        </div>
        
        {/* Console Simulation */}
        <div className="h-32 bg-black border-x border-b border-slate-700 rounded-b p-2 font-mono text-[10px] overflow-y-auto">
           <div className="text-slate-500 border-b border-slate-800 mb-1 pb-1 flex justify-between">
              <span>TERMINAL / CONSOLE</span>
              <span className="text-green-500 cursor-pointer hover:underline">Clear</span>
           </div>
           <div className="text-slate-300">> Loading libraries... OK</div>
           <div className="text-slate-300">> Running dry-run on 1 document...</div>
           <div className="text-blue-400">[INFO] Splitter initialized (chunk_size=512)</div>
           <div className="text-yellow-400">[WARN] Doc ID 'D-04' missing metadata, using defaults.</div>
           <div className="text-green-400">> Process finished. Output: 8 chunks generated.</div>
        </div>
     </div>
  );

  // 4. Model Node Config (Embedding Playground)
  const renderModelConfig = () => (
     <div className="flex flex-col h-full space-y-5">
        <div className="space-y-3">
           <label className="text-xs font-bold text-slate-400 block">模型配置 (Embedding)</label>
           <select className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200">
              <option>BAAI/bge-m3 (Dense + Sparse)</option>
              <option>OpenAI text-embedding-3-large</option>
              <option>Jina-Embeddings-v2-Base-zh</option>
           </select>
           
           <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-slate-900/50 p-2 rounded border border-slate-700">
                 <div className="text-[10px] text-slate-500 uppercase">Dimension</div>
                 <div className="text-sm font-mono text-blue-300">1024</div>
              </div>
              <div className="bg-slate-900/50 p-2 rounded border border-slate-700">
                 <div className="text-[10px] text-slate-500 uppercase">Max Tokens</div>
                 <div className="text-sm font-mono text-blue-300">8192</div>
              </div>
           </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
           <div className="bg-slate-900 p-2 border-b border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              Live Test Playground
           </div>
           <div className="p-3 flex-1 overflow-y-auto space-y-3">
              <div>
                 <label className="text-[10px] text-slate-500 uppercase block mb-1">Input Text</label>
                 <textarea 
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-300 h-20 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                    defaultValue="全氟化合物(PFAS)在长江流域的生物富集效应研究..."
                 ></textarea>
              </div>
              <div className="flex justify-end">
                 <button className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500">Generate Vector</button>
              </div>
              <div>
                 <label className="text-[10px] text-slate-500 uppercase block mb-1">Vector Output (Preview)</label>
                 <div className="bg-black p-2 rounded border border-slate-800 text-[10px] font-mono text-green-400 break-all h-24 overflow-y-auto">
                    [-0.0241, 0.1542, -0.0032, 0.0871, -0.1120, 0.0456, ... <span className="text-slate-600">(1024 dims)</span>]
                 </div>
              </div>
           </div>
        </div>
     </div>
  );

  // 5. Sink Node Config (DB Mapping)
  const renderSinkConfig = () => (
     <div className="flex flex-col h-full space-y-5">
        <div className="bg-slate-900/50 p-3 rounded border border-slate-700 flex items-center gap-3">
           <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center border border-slate-600">
              <Database className="w-5 h-5 text-green-400" />
           </div>
           <div>
              <div className="font-bold text-sm text-slate-200">Milvus Vector DB</div>
              <div className="text-xs text-slate-500">Host: 192.168.1.104:19530</div>
           </div>
        </div>

        <div>
           <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">Schema Mapping</span>
              <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Validated</span>
           </div>
           <div className="border border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-left text-[11px]">
                 <thead className="bg-slate-900 text-slate-500">
                    <tr>
                       <th className="p-2 w-1/3">Pipeline Field</th>
                       <th className="p-2 w-1/6 text-center">-></th>
                       <th className="p-2 w-1/3">Collection Field</th>
                       <th className="p-2 w-1/6">Type</th>
                    </tr>
                 </thead>
                 <tbody className="bg-slate-950 divide-y divide-slate-800 text-slate-300">
                    <tr>
                       <td className="p-2 font-mono text-blue-300">chunk_id</td>
                       <td className="p-2 text-center text-slate-600">-></td>
                       <td className="p-2 font-mono">id</td>
                       <td className="p-2 text-slate-500">VarChar</td>
                    </tr>
                    <tr>
                       <td className="p-2 font-mono text-blue-300">embedding</td>
                       <td className="p-2 text-center text-slate-600">-></td>
                       <td className="p-2 font-mono">vector</td>
                       <td className="p-2 text-slate-500">FloatVec</td>
                    </tr>
                    <tr>
                       <td className="p-2 font-mono text-blue-300">meta</td>
                       <td className="p-2 text-center text-slate-600">-></td>
                       <td className="p-2 font-mono">payload</td>
                       <td className="p-2 text-slate-500">JSON</td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>

        <div className="flex-1 bg-slate-900 rounded border border-slate-800 p-3 flex flex-col">
           <div className="text-xs font-bold text-slate-400 mb-2">Sync Performance</div>
           <div className="flex-1 flex items-end justify-between gap-1 px-2 pb-2 border-b border-slate-700 mb-1">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75].map((h, i) => (
                 <div key={i} className="w-full bg-blue-600/40 hover:bg-blue-500 transition-colors rounded-t" style={{ height: `${h}%` }}></div>
              ))}
           </div>
           <div className="flex justify-between text-[10px] text-slate-500">
              <span>Avg: 1200 docs/sec</span>
              <span>Latency: 24ms</span>
           </div>
        </div>
     </div>
  );

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-1 overflow-hidden gap-0 bg-slate-900 border border-slate-700 rounded-lg">
          
          {/* 1. Left: Operator Palette (Unchanged but refined style) */}
          <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col shrink-0">
             <div className="p-3 border-b border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <GripVertical className="w-3.5 h-3.5" /> 算子库 (Operators)
             </div>
             <div className="p-3 space-y-4 overflow-y-auto custom-scrollbar">
                <div>
                   <div className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-wider">I/O & Source</div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-700 cursor-grab text-xs text-slate-300 transition-colors border border-transparent hover:border-slate-600">
                         <Database className="w-3.5 h-3.5 text-blue-400" /> 结构化数据 (JDBC)
                      </div>
                      <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-700 cursor-grab text-xs text-slate-300 transition-colors border border-transparent hover:border-slate-600">
                         <FileJson className="w-3.5 h-3.5 text-yellow-400" /> 对象存储 (S3)
                      </div>
                      <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-700 cursor-grab text-xs text-slate-300 transition-colors border border-transparent hover:border-slate-600">
                         <Share2 className="w-3.5 h-3.5 text-green-400" /> 知识图谱写入
                      </div>
                   </div>
                </div>
                <div>
                   <div className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-wider">Transform</div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-700 cursor-grab text-xs text-slate-300 transition-colors border border-transparent hover:border-slate-600">
                         <Table className="w-3.5 h-3.5 text-purple-400" /> 字段映射 (Mapping)
                      </div>
                      <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-700 cursor-grab text-xs text-slate-300 transition-colors border border-transparent hover:border-slate-600">
                         <Code className="w-3.5 h-3.5 text-pink-400" /> Python 脚本
                      </div>
                      <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-700 cursor-grab text-xs text-slate-300 transition-colors border border-transparent hover:border-slate-600">
                         <Sparkles className="w-3.5 h-3.5 text-orange-400" /> 智能清洗 (LLM)
                      </div>
                   </div>
                </div>
                <div>
                   <div className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-wider">AI Model</div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-700 cursor-grab text-xs text-slate-300 transition-colors border border-transparent hover:border-slate-600">
                         <Layers className="w-3.5 h-3.5 text-blue-400" /> 文本向量化
                      </div>
                      <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-700 cursor-grab text-xs text-slate-300 transition-colors border border-transparent hover:border-slate-600">
                         <Network className="w-3.5 h-3.5 text-indigo-400" /> 实体关系抽取
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* 2. Center: Canvas */}
          <div className="flex-1 bg-slate-900 relative overflow-auto bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-opacity-20">
             {/* Background Grid */}
             <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:20px_20px]"></div>

             {/* SVG Connections */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                   <marker id="arrow-pipeline" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                   </marker>
                </defs>
                <path d="M 210 132 L 280 132" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow-pipeline)" fill="none" />
                <path d="M 440 132 L 510 132" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow-pipeline)" fill="none" />
                <path d="M 670 132 L 740 132" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow-pipeline)" fill="none" />
                <path d="M 900 132 L 970 132" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow-pipeline)" fill="none" />
             </svg>

             {/* Nodes */}
             <div className="relative w-full h-full p-10">
                {initialPipelineNodes.map(node => (
                   <div 
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      style={{ left: node.x, top: node.y }}
                      className={`absolute w-40 p-3 rounded-lg border shadow-lg cursor-pointer transition-all hover:scale-105 z-10 flex flex-col gap-2 ${
                         selectedNodeId === node.id 
                           ? 'bg-slate-800 border-blue-500 ring-2 ring-blue-500/50 shadow-blue-900/50' 
                           : 'bg-slate-800 border-slate-600 hover:border-slate-500'
                      }`}
                   >
                      <div className="flex items-center gap-2">
                         <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                            node.type === 'source' ? 'bg-blue-900/50 text-blue-400' :
                            node.type === 'transform' ? 'bg-purple-900/50 text-purple-400' :
                            node.type === 'code' ? 'bg-pink-900/50 text-pink-400' :
                            node.type === 'model' ? 'bg-indigo-900/50 text-indigo-400' :
                            'bg-green-900/50 text-green-400'
                         }`}>
                            {node.type === 'source' && <FileJson className="w-3.5 h-3.5" />}
                            {node.type === 'transform' && <Table className="w-3.5 h-3.5" />}
                            {node.type === 'code' && <Code className="w-3.5 h-3.5" />}
                            {node.type === 'model' && <Layers className="w-3.5 h-3.5" />}
                            {node.type === 'sink' && <Database className="w-3.5 h-3.5" />}
                         </div>
                         <div className="flex flex-col overflow-hidden">
                            <div className="text-[10px] text-slate-500 uppercase font-bold leading-none mb-0.5">{node.type}</div>
                            <div className="text-xs font-bold text-slate-200 truncate leading-none">{node.label}</div>
                         </div>
                      </div>
                      
                      {/* Node specific info */}
                      {node.desc && (
                         <div className="text-[9px] text-slate-400 leading-tight border-t border-slate-700/50 pt-1.5 mt-0.5">
                            {node.desc}
                         </div>
                      )}

                      {/* Status Indicator */}
                      {node.status === 'processing' && (
                         <div className="h-1 bg-slate-700 rounded-full overflow-hidden w-full mt-1">
                            <div className="h-full bg-blue-500 animate-progress w-2/3"></div>
                         </div>
                      )}
                      {node.status === 'ready' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>}
                   </div>
                ))}
             </div>
          </div>

          {/* 3. Right: Enhanced Configuration Panel (The "Next Layer") */}
          <div className="w-[450px] bg-slate-800 border-l border-slate-700 flex flex-col shrink-0 shadow-2xl z-20">
             {/* Header */}
             <div className="h-14 border-b border-slate-700 flex justify-between items-center px-5 bg-slate-800 shrink-0">
                <div className="overflow-hidden">
                   <h3 className="text-sm font-bold text-slate-100 truncate">{selectedNode?.label || 'Select a node'}</h3>
                   <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                      <span className="bg-slate-900 px-1.5 rounded">ID: {selectedNode?.id}</span>
                      <span>Type: {selectedNode?.type}</span>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors" title="Settings">
                      <Settings2 className="w-4 h-4" />
                   </button>
                   <button className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded text-white shadow-lg shadow-blue-900/50 transition-colors" title="Run Node">
                      <Play className="w-4 h-4 fill-current" />
                   </button>
                </div>
             </div>

             {/* Dynamic Content Area */}
             <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-[#111827]">
                {selectedNode?.type === 'source' && renderSourceConfig()}
                {selectedNode?.type === 'transform' && renderTransformConfig()}
                {selectedNode?.type === 'code' && renderCodeConfig()}
                {selectedNode?.type === 'model' && renderModelConfig()}
                {selectedNode?.type === 'sink' && renderSinkConfig()}
                
                {!selectedNode && (
                   <div className="h-full flex flex-col items-center justify-center text-slate-600">
                      <MousePointer2 className="w-12 h-12 mb-3 opacity-20" />
                      <p>请在左侧画布选择一个节点<br/>以查看详细配置与数据预览</p>
                   </div>
                )}
             </div>

             {/* Footer Status */}
             <div className="h-8 border-t border-slate-700 bg-slate-800 flex items-center justify-between px-4 text-[10px] text-slate-500">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                   Node Service: Healthy
                </div>
                <div>Last Run: 2 mins ago</div>
             </div>
          </div>
       </div>
    </div>
  );
};

const MCPRegistry = () => {
  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-lg flex gap-4 items-start">
          <Terminal className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
             <h4 className="text-sm font-bold text-blue-100 mb-1">MCP 工具注册中心 (Model Context Protocol)</h4>
             <p className="text-xs text-blue-300/80 leading-relaxed">
                管理 LLM 与物理实验室交互的标准协议接口。定义工具的 Schema、权限范围及执行方式，使智能体能够安全地调用外部工具、查询数据库或控制实验设备。
             </p>
          </div>
       </div>

       <div className="flex-1 overflow-hidden bg-slate-800 border border-slate-700 rounded-lg flex flex-col">
          <div className="grid grid-cols-12 border-b border-slate-700 bg-slate-900/50 text-xs font-medium text-slate-400">
             <div className="col-span-3 p-3 pl-4">工具标识 (ID / Name)</div>
             <div className="col-span-2 p-3">类型</div>
             <div className="col-span-4 p-3">功能描述</div>
             <div className="col-span-2 p-3">权限级别</div>
             <div className="col-span-1 p-3 text-right pr-4">配置</div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
             {mcpTools.map(tool => (
               <div key={tool.id} className="grid grid-cols-12 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors text-sm group relative">
                  <div className="col-span-3 p-3 pl-4">
                     <div className="font-medium text-slate-200">{tool.displayName}</div>
                     <div className="text-[10px] font-mono text-blue-400 mt-0.5 flex items-center gap-1">
                        <Box className="w-3 h-3 opacity-50" />
                        {tool.name}
                     </div>
                  </div>
                  <div className="col-span-2 p-3 text-slate-400 flex items-center gap-1.5">
                     {tool.type === '数据检索' && <Database className="w-3.5 h-3.5 text-blue-400" />}
                     {tool.type === '设备控制' && <Zap className="w-3.5 h-3.5 text-yellow-400" />}
                     {tool.type === '计算分析' && <Cpu className="w-3.5 h-3.5 text-purple-400" />}
                     {tool.type === '系统集成' && <Network className="w-3.5 h-3.5 text-green-400" />}
                     {tool.type === '知识查询' && <Share2 className="w-3.5 h-3.5 text-pink-400" />}
                     {tool.type === '文档处理' && <FileJson className="w-3.5 h-3.5 text-slate-400" />}
                     <span>{tool.type}</span>
                  </div>
                  <div className="col-span-4 p-3 text-slate-300 text-xs leading-relaxed flex items-center">{tool.desc}</div>
                  <div className="col-span-2 p-3 flex items-center">
                     <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${
                        tool.permission === 'Admin' ? 'bg-red-900/20 text-red-400 border-red-800' :
                        tool.permission === 'Read-Only' ? 'bg-green-900/20 text-green-400 border-green-800' :
                        tool.permission === 'Execute' ? 'bg-purple-900/20 text-purple-400 border-purple-800' :
                        'bg-blue-900/20 text-blue-400 border-blue-800'
                     }`}>
                        {tool.permission}
                     </span>
                  </div>
                  <div className="col-span-1 p-3 text-right pr-4 flex items-center justify-end">
                     <button className="text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded border border-transparent hover:border-slate-600 transition-all">
                        <Settings2 className="w-4 h-4" />
                     </button>
                  </div>
                  
                  {/* Schema Preview on Hover */}
                  <div className="absolute left-0 right-0 top-full hidden group-hover:block z-20 animate-in fade-in slide-in-from-top-1 duration-200">
                     <div className="bg-slate-950 border-y border-slate-700 p-3 shadow-xl">
                        <div className="flex items-start gap-2">
                           <FileCode className="w-4 h-4 text-slate-500 mt-0.5" />
                           <div className="flex-1">
                              <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Parameters Schema</div>
                              <code className="text-xs font-mono text-green-300 block bg-slate-900/50 p-2 rounded border border-slate-800">
                                 {tool.schema}
                              </code>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
          <div className="p-3 bg-slate-900 border-t border-slate-700 flex justify-center">
             <button className="text-xs text-slate-400 hover:text-white flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded transition-colors">
                <Plus className="w-3.5 h-3.5" /> 注册新工具 (Register Tool)
             </button>
          </div>
       </div>
    </div>
  );
};


// --- Main Component ---

const AIConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agents' | 'connectors' | 'processing' | 'mcp'>('agents');
  const [agents, setAgents] = useState<AgentConfig[]>(initialAgents);

  const tabs = [
    { id: 'agents', label: '智能体编排', icon: Bot },
    { id: 'connectors', label: '数据连接器', icon: Network },
    { id: 'processing', label: '数据处理 (Pipeline)', icon: Workflow },
    { id: 'mcp', label: 'MCP 工具集', icon: Terminal },
  ];

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-500" />
            AI 基础设施与中台 (AI Platform)
          </h2>
          <p className="text-sm text-slate-400">全栈式 AI 操作系统：从数据连接、知识工程流水线到智能体编排与工具协议 (MCP) 管理。</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded text-sm transition-colors">
              <Key className="w-4 h-4" /> API Keys
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium transition-colors shadow-lg shadow-blue-900/50">
              <Save className="w-4 h-4" /> 保存全局配置
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 mb-6 shrink-0">
         {tabs.map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 ${
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
      <div className="flex-1 overflow-hidden bg-slate-900/30 rounded-lg relative">
         <div className="absolute inset-0 overflow-y-auto p-1 custom-scrollbar">
            {activeTab === 'agents' && <AgentOrchestration agents={agents} setAgents={setAgents} />}
            {activeTab === 'connectors' && <DataConnectors />}
            {activeTab === 'processing' && <DataPipelineBuilder />}
            {activeTab === 'mcp' && <MCPRegistry />}
         </div>
      </div>
    </div>
  );
};

export default AIConfig;