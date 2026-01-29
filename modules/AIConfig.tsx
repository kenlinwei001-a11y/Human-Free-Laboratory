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
  ArrowDownToLine, HardDrive, Braces, Link2, 
  Wand2, TableProperties, AlertCircle, Command,
  Sliders
} from 'lucide-react';

// --- Mock Data: Agents ---
const initialAgents: AgentConfig[] = [
  { id: 'agent-1', name: '新污染物发现智能体', role: '发现与初筛', model: 'Qwen-72B (通义千问)', strategy: 'exploratory', isEnabled: true },
  { id: 'agent-2', name: '结构解析智能体', role: '分子结构推断', model: '传神任度大模型 (RenDu)', strategy: 'balanced', isEnabled: true },
  { id: 'agent-3', name: '风险评估智能体', role: '多维风险计算', model: 'DeepSeek-V2 (深度求索)', strategy: 'conservative', isEnabled: true },
  { id: 'agent-4', name: '实验调度智能体', role: '设备资源排期', model: 'GLM-4 (智谱AI)', strategy: 'conservative', isEnabled: false },
];

// --- Mock Data: Connectors ---
const connectors = [
  { id: 'conn-1', name: 'Lab-LIMS 核心库', type: 'PostgreSQL', status: 'connected', latency: '12ms', lastSync: '1 分钟前', icon: Database },
  { id: 'conn-2', name: '仪器 IoT 消息总线', type: 'MQTT/Kafka', status: 'connected', latency: '4ms', lastSync: '实时', icon: Zap },
  { id: 'conn-5', name: 'SAP S/4HANA (物资)', type: 'OData / RFC', status: 'connected', latency: '150ms', lastSync: '1 小时前', icon: Box },
  { id: 'conn-6', name: '企业 OA (泛微/钉钉)', type: 'API Gateway / Webhook', status: 'connected', latency: '35ms', lastSync: '实时', icon: Building2 },
  { id: 'conn-3', name: 'PubChem 镜像库', type: 'REST API', status: 'error', latency: '-', lastSync: '2 天前', icon: Network },
  { id: 'conn-4', name: '原始质谱数据存储', type: 'S3 / MinIO', status: 'connected', latency: '45ms', lastSync: '10 分钟前', icon: Server },
];

// --- Mock Data: MCP Tools ---
const mcpTools = [
  { id: 't1', name: 'retrieve_spectrum_library', displayName: '检索标准质谱库', type: '数据检索', desc: '根据母离子 m/z 和保留时间窗口检索内部标准品库，返回匹配度最高的候选物列表。', schema: '{"mz": "number", "rt_window": "number", "top_k": "integer"}', permission: 'Read-Only' },
  { id: 't2', name: 'control_robotic_arm', displayName: '控制机械臂移动', type: '设备控制', desc: '控制样品前处理机械臂将样品盘从指定位置移动到目标位置。', schema: '{"source_slot": "string", "target_slot": "string", "speed": "enum[slow,fast]"}', permission: 'Admin' },
  { id: 't3', name: 'run_toxicity_prediction', displayName: '运行毒性预测模型', type: '计算分析', desc: '调用本地 Python 环境中的 QSAR 模型，基于 SMILES 预测 LC50 毒性值。', schema: '{"smiles": "string", "model_version": "string"}', permission: 'Execute' },
  { id: 't4', name: 'query_lims_sample_status', displayName: '查询 LIMS 样本状态', type: '系统集成', desc: '查询实验室信息管理系统中特定样本ID的流转状态和元数据。', schema: '{"sample_id": "string"}', permission: 'Read-Only' },
  { id: 't5', name: 'search_knowledge_graph', displayName: '检索知识图谱', type: '知识查询', desc: '通过 Cypher 语句查询新污染物知识图谱，获取化合物关联的文献和法规信息。', schema: '{"entity_name": "string", "relation_type": "string"}', permission: 'Read-Only' },
  { id: 't6', name: 'adjust_hplc_params', displayName: '调节 HPLC 参数', type: '设备控制', desc: '动态调整液相色谱的流速、柱温箱温度或流动相配比。', schema: '{"flow_rate": "float", "temperature": "float", "solvent_ratio": "object"}', permission: 'Admin' },
  { id: 't7', name: 'generate_experiment_report', displayName: '生成实验报告', type: '文档处理', desc: '基于模板 ID 和实验数据 ID，自动生成 PDF 格式的实验总结报告。', schema: '{"template_id": "string", "data_ids": "array<string>"}', permission: 'Write' },
  { id: 't8', name: 'jdbc_query_executor', displayName: '通用 SQL 执行器', type: '系统集成', desc: '执行只读 SQL 查询以提取结构化数据。', schema: '{"sql": "string", "timeout": "int"}', permission: 'Read-Only' },
  { id: 't9', name: 's3_object_reader', displayName: 'S3 对象读取器', type: '数据检索', desc: '从对象存储中流式读取非结构化文件。', schema: '{"bucket": "string", "key": "string"}', permission: 'Read-Only' },
  { id: 't10', name: 'kg_batch_writer', displayName: '图谱批量写入', type: '知识查询', desc: '将实体和关系批量写入图数据库。', schema: '{"triples": "array"}', permission: 'Write' },
];

// --- Types for Pipeline Builder ---
type OperatorType = 'source_jdbc' | 'source_s3' | 'trans_ocr' | 'trans_mapping' | 'trans_python' | 'trans_llm' | 'model_embedding' | 'model_ner' | 'sink_vec' | 'sink_kg';

interface PipelineNode {
  id: string;
  type: OperatorType;
  label: string;
  status: 'ready' | 'processing' | 'error';
  x: number;
  y: number;
  desc?: string;
}

const initialPipelineNodes: PipelineNode[] = [
  { id: 'n1', type: 'source_s3', label: 'S3: 原始 PDF 文献集', status: 'ready', x: 50, y: 100, desc: '连接到 minIO 存储桶 "raw-papers-2024"' },
  { id: 'n2', type: 'trans_ocr', label: 'OCR 与元数据提取', status: 'ready', x: 280, y: 100, desc: 'PaddleOCR v4 + 正则表达式提取' },
  { id: 'n3', type: 'trans_python', label: '文本分块 (Python)', status: 'ready', x: 510, y: 100, desc: 'LangChain RecursiveSplitter' },
  { id: 'n4', type: 'model_embedding', label: 'BGE-M3 向量化', status: 'processing', x: 740, y: 100, desc: 'BAAI General Embedding' },
  { id: 'n5', type: 'sink_vec', label: 'Milvus 向量库写入', status: 'ready', x: 970, y: 100, desc: 'Collection: pollutant_knowledge' },
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
  // Config state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('n3');
  const [previewOperator, setPreviewOperator] = useState<OperatorType | null>(null);

  // Derive display context
  const activeNode = selectedNodeId ? initialPipelineNodes.find(n => n.id === selectedNodeId) : null;
  const activeType = activeNode ? activeNode.type : previewOperator;
  const activeLabel = activeNode ? activeNode.label : (previewOperator ? `配置工坊: ${previewOperator}` : 'No Selection');

  // --- Reusable Config Components ---

  const MCPSelector = ({ label, category }: { label: string, category: string }) => (
    <div className="space-y-2 pt-2 border-t border-slate-700/50">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-slate-400 flex items-center gap-1">
          <Command className="w-3 h-3 text-purple-400" /> {label} (MCP)
        </label>
        <span className="text-[10px] bg-purple-900/30 text-purple-300 px-1.5 rounded border border-purple-500/20">Protocol Binding</span>
      </div>
      <select className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-300">
         <option value="">-- 选择执行工具 --</option>
         {mcpTools.filter(t => t.type === category).map(t => (
           <option key={t.id} value={t.id}>{t.displayName} ({t.name})</option>
         ))}
         {mcpTools.filter(t => t.type !== category).map(t => (
           <option key={t.id} value={t.id} disabled className="text-slate-600">{t.displayName} (Type Mismatch)</option>
         ))}
      </select>
      <div className="text-[10px] text-slate-500">
        绑定后，该节点将通过 Model Context Protocol 调用选定工具执行实际逻辑。
      </div>
    </div>
  );

  const ConfigSection = ({ title, icon: Icon, children }: any) => (
    <div className="space-y-3 pb-4">
       <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Icon className="w-4 h-4 text-blue-400" /> {title}
       </div>
       {children}
    </div>
  );

  // --- Configuration Panel Renderers ---

  // 1. Source: S3 Object Storage
  const renderS3Config = () => (
     <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-300">
        <ConfigSection title="连接配置" icon={Plug}>
           <div className="grid grid-cols-2 gap-3">
              <div>
                 <label className="block text-xs text-slate-500 mb-1">存储类型</label>
                 <select className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200">
                    <option>S3 Compatible (MinIO)</option>
                    <option>AWS S3</option>
                    <option>Aliyun OSS</option>
                 </select>
              </div>
              <div>
                 <label className="block text-xs text-slate-500 mb-1">Region</label>
                 <input type="text" defaultValue="cn-east-1" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200" />
              </div>
           </div>
           <div>
              <label className="block text-xs text-slate-500 mb-1">Bucket Name</label>
              <div className="flex gap-2">
                 <input type="text" defaultValue="raw-papers-2024" className="flex-1 bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200" />
                 <button className="px-3 bg-slate-800 border border-slate-600 rounded text-xs hover:bg-slate-700">Browse</button>
              </div>
           </div>
        </ConfigSection>

        <ConfigSection title="数据过滤" icon={ListFilter}>
           <div>
              <label className="block text-xs text-slate-500 mb-1">文件通配符 (Glob Pattern)</label>
              <input type="text" defaultValue="**/*.pdf" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs font-mono text-green-400" />
           </div>
           <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-600" />
              <span className="text-xs text-slate-400">递归子目录</span>
           </div>
        </ConfigSection>

        <MCPSelector label="读取执行器" category="数据检索" />

        <div className="flex-1 flex flex-col min-h-[150px] border-t border-slate-700/50 pt-4">
           <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400">预览文件列表</span>
              <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Connection OK</span>
           </div>
           <div className="bg-slate-950 border border-slate-700 rounded flex-1 overflow-auto p-2">
              <div className="text-[10px] font-mono text-slate-300 space-y-1">
                 <div className="flex justify-between hover:bg-slate-900 px-1"><span>PFAS_Toxicity_Review.pdf</span><span className="text-slate-500">2.4MB</span></div>
                 <div className="flex justify-between hover:bg-slate-900 px-1"><span>Yangtze_River_Survey.pdf</span><span className="text-slate-500">1.8MB</span></div>
                 <div className="flex justify-between hover:bg-slate-900 px-1"><span>GB_5749_Method.pdf</span><span className="text-slate-500">4.2MB</span></div>
              </div>
           </div>
        </div>
     </div>
  );

  // 2. Source: JDBC
  const renderJDBCConfig = () => (
     <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-300">
        <ConfigSection title="数据库连接" icon={Database}>
           <div>
              <label className="block text-xs text-slate-500 mb-1">Driver Class</label>
              <select className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200">
                 <option>org.postgresql.Driver</option>
                 <option>com.mysql.cj.jdbc.Driver</option>
                 <option>oracle.jdbc.OracleDriver</option>
              </select>
           </div>
           <div>
              <label className="block text-xs text-slate-500 mb-1">JDBC URL</label>
              <input type="text" defaultValue="jdbc:postgresql://192.168.1.50:5432/lims_production" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs font-mono text-slate-300" />
           </div>
           <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Username" defaultValue="readonly_user" className="bg-slate-900 border border-slate-600 rounded p-2 text-xs" />
              <input type="password" placeholder="Password" defaultValue="******" className="bg-slate-900 border border-slate-600 rounded p-2 text-xs" />
           </div>
        </ConfigSection>

        <ConfigSection title="查询配置" icon={Code}>
           <div>
              <label className="block text-xs text-slate-500 mb-1">SQL Query</label>
              <textarea className="w-full h-24 bg-slate-900 border border-slate-600 rounded p-2 text-xs font-mono text-blue-200 resize-none focus:ring-1 focus:ring-blue-500" defaultValue="SELECT * FROM samples WHERE created_at > NOW() - INTERVAL '7 days'"></textarea>
           </div>
        </ConfigSection>
        
        <MCPSelector label="SQL 执行代理" category="系统集成" />

        <div className="bg-slate-800 p-3 rounded border border-slate-700 flex justify-center">
           <button className="flex items-center gap-2 text-xs text-blue-400 hover:text-white transition-colors">
              <Play className="w-3 h-3" /> 测试连接并预览前 10 行
           </button>
        </div>
     </div>
  );

  // 3. Transform: OCR
  const renderOCRConfig = () => (
     <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-300">
        <ConfigSection title="OCR 引擎参数" icon={Sliders}>
           <div>
              <label className="block text-xs text-slate-500 mb-1">识别引擎</label>
              <select className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200">
                 <option>PaddleOCR v4 (Local)</option>
                 <option>Tesseract 5.0</option>
                 <option>Azure AI Vision</option>
              </select>
           </div>
           <div className="grid grid-cols-2 gap-3">
              <div>
                 <label className="block text-xs text-slate-500 mb-1">语言模型</label>
                 <select className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200">
                    <option>中英文混合 (CH-EN)</option>
                    <option>纯英文 (EN)</option>
                    <option>化学公式增强</option>
                 </select>
              </div>
              <div>
                 <label className="block text-xs text-slate-500 mb-1">置信度阈值</label>
                 <input type="number" defaultValue="0.85" step="0.05" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200" />
              </div>
           </div>
        </ConfigSection>

        <ConfigSection title="正则表达式提取" icon={Regex}>
           <div className="border border-slate-700 rounded bg-slate-950 p-2 h-32 overflow-y-auto space-y-2">
              {[
                 { name: 'CAS No.', regex: '\\b\\d{2,7}-\\d{2}-\\d\\b' },
                 { name: 'Concentration', regex: '([0-9.]+)\\s*(mg/L|ug/L)' }
              ].map((r, i) => (
                 <div key={i} className="flex flex-col gap-1 border-b border-slate-800 pb-2 last:border-0">
                    <div className="flex justify-between">
                       <span className="text-[10px] text-blue-400 font-bold">{r.name}</span>
                       <button className="text-[10px] text-slate-500 hover:text-red-400">Remove</button>
                    </div>
                    <code className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1 rounded">{r.regex}</code>
                 </div>
              ))}
              <button className="w-full text-center text-[10px] text-slate-500 hover:text-white border border-dashed border-slate-700 py-1 rounded">+ Add Pattern</button>
           </div>
        </ConfigSection>

        <MCPSelector label="文档处理服务" category="文档处理" />
     </div>
  );

  // 4. Transform: Mapping
  const renderMappingConfig = () => (
     <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-300">
        <ConfigSection title="Schema 映射" icon={TableProperties}>
           <div className="flex items-center justify-between text-xs text-slate-400 px-2 mb-2">
              <span>Source Field</span>
              <span>Target Field</span>
           </div>
           <div className="space-y-2">
              {[
                { s: 'raw_cas', t: 'cas_id', type: 'String' },
                { s: 'val_conc', t: 'concentration', type: 'Float' },
                { s: 'unit_txt', t: 'unit', type: 'String' }
              ].map((m, i) => (
                 <div key={i} className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-700">
                    <div className="flex-1 font-mono text-[10px] text-slate-300 truncate" title={m.s}>{m.s}</div>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <div className="flex-1 font-mono text-[10px] text-blue-300 truncate" title={m.t}>{m.t}</div>
                    <span className="text-[9px] bg-slate-800 px-1 rounded text-slate-500">{m.type}</span>
                 </div>
              ))}
           </div>
           <button className="w-full mt-2 py-1.5 border border-slate-600 bg-slate-800 rounded text-xs text-slate-300 hover:bg-slate-700">自动匹配字段 (Auto Map)</button>
        </ConfigSection>

        <ConfigSection title="转换规则" icon={Wand2}>
           <div className="bg-slate-900 p-3 rounded border border-slate-700 space-y-2">
              <label className="flex items-center gap-2 text-xs text-slate-300">
                 <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-600" />
                 忽略空值 (Drop Nulls)
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300">
                 <input type="checkbox" className="rounded bg-slate-800 border-slate-600" />
                 强制类型转换 (Strict Cast)
              </label>
           </div>
        </ConfigSection>
     </div>
  );

  // 5. Transform: Python
  const renderPythonConfig = () => (
     <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-300">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Code className="w-4 h-4 text-pink-400" /> 脚本编辑器
           </div>
           <select className="bg-slate-900 border border-slate-600 rounded text-[10px] px-2 py-1 text-slate-400">
              <option>Python 3.9</option>
              <option>Python 3.10</option>
           </select>
        </div>
        
        <div className="flex-1 border border-slate-700 rounded overflow-hidden flex flex-col">
           <div className="bg-[#0d1117] flex-1 p-3 font-mono text-xs text-slate-300 overflow-auto custom-scrollbar leading-relaxed">
              <span className="text-purple-400">def</span> <span className="text-yellow-200">process_record</span>(record):<br/>
              &nbsp;&nbsp;<span className="text-slate-500"># Custom transformation logic</span><br/>
              &nbsp;&nbsp;<span className="text-purple-400">if</span> record[<span className="text-green-300">'value'</span>] &lt; <span className="text-orange-300">0</span>:<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;record[<span className="text-green-300">'flag'</span>] = <span className="text-green-300">'invalid'</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;record[<span className="text-green-300">'value'</span>] = <span className="text-blue-300">None</span><br/>
              &nbsp;&nbsp;<span className="text-purple-400">return</span> record
           </div>
           <div className="bg-slate-800 p-2 border-t border-slate-700 flex justify-between items-center">
              <span className="text-[10px] text-slate-500">Ln 6, Col 1</span>
              <button className="text-[10px] text-green-400 hover:text-green-300 flex items-center gap-1"><Play className="w-3 h-3" /> Test Run</button>
           </div>
        </div>

        <ConfigSection title="依赖管理" icon={Box}>
           <input type="text" placeholder="pip install (e.g., numpy pandas)" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-300" />
        </ConfigSection>
     </div>
  );

  // 6. Transform: LLM
  const renderLLMConfig = () => (
     <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-300">
        <ConfigSection title="模型设定" icon={Bot}>
           <select className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200 mb-2">
              <option>DeepSeek-Coder-33B</option>
              <option>Qwen-72B-Chat</option>
              <option>GPT-4o (Azure)</option>
           </select>
           <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-16">Temperature</span>
              <input type="range" className="flex-1 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              <span className="text-xs text-slate-300 w-6">0.1</span>
           </div>
        </ConfigSection>

        <ConfigSection title="Prompt 编排" icon={Terminal}>
           <div className="bg-slate-900 border border-slate-600 rounded p-2 h-40 overflow-auto custom-scrollbar">
              <div className="text-[10px] text-slate-500 mb-1">SYSTEM PROMPT</div>
              <textarea className="w-full bg-transparent border-none text-xs text-slate-300 font-mono focus:ring-0 resize-none h-full" defaultValue="You are a data cleaning expert. Extract chemical entities from the input text and format them as JSON."></textarea>
           </div>
        </ConfigSection>

        <MCPSelector label="推理后端" category="计算分析" />
     </div>
  );

  // 7. Model: Embedding
  const renderEmbeddingConfig = () => (
     <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-300">
        <ConfigSection title="Embedding 模型" icon={Layers}>
           <select className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200">
              <option>BAAI/bge-m3 (Multilingual)</option>
              <option>OpenAI text-embedding-3-large</option>
              <option>Jina-Embeddings-v2</option>
           </select>
           <div className="bg-slate-900/50 p-2 rounded border border-slate-700 text-[10px] text-slate-400 space-y-1 mt-2">
              <div className="flex justify-between"><span>Dimensions:</span> <span className="text-slate-200">1024</span></div>
              <div className="flex justify-between"><span>Max Tokens:</span> <span className="text-slate-200">8192</span></div>
           </div>
        </ConfigSection>

        <ConfigSection title="处理策略" icon={Settings2}>
           <div className="space-y-3">
              <div>
                 <label className="block text-xs text-slate-500 mb-1">Batch Size</label>
                 <input type="number" defaultValue="32" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200" />
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-300">
                 <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-600" />
                 Normalize Embeddings
              </label>
           </div>
        </ConfigSection>
        
        <MCPSelector label="向量化服务" category="计算分析" />
     </div>
  );

  // 8. Model: NER
  const renderNERConfig = () => (
     <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-300">
        <ConfigSection title="NER 模型" icon={Cpu}>
           <select className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200">
              <option>BERT-Base-Chinese-NER</option>
              <option>SciBERT-Chemistry</option>
           </select>
        </ConfigSection>

        <ConfigSection title="实体类型定义" icon={ListFilter}>
           <div className="flex flex-wrap gap-2">
              {['Chemical', 'Location', 'Method', 'Date', 'Concentration'].map(tag => (
                 <span key={tag} className="px-2 py-1 rounded bg-slate-800 border border-slate-600 text-[10px] text-slate-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" /> {tag}
                 </span>
              ))}
              <button className="px-2 py-1 rounded border border-dashed border-slate-600 text-[10px] text-slate-500 hover:text-white">+ Add</button>
           </div>
        </ConfigSection>
        
        <MCPSelector label="推理服务" category="计算分析" />
     </div>
  );

  // 9. Sink: Vector DB
  const renderVectorDBConfig = () => (
     <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-300">
        <ConfigSection title="Milvus 连接" icon={HardDrive}>
           <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Host" defaultValue="192.168.1.104" className="bg-slate-900 border border-slate-600 rounded p-2 text-xs" />
              <input type="text" placeholder="Port" defaultValue="19530" className="bg-slate-900 border border-slate-600 rounded p-2 text-xs" />
           </div>
           <div>
              <label className="block text-xs text-slate-500 mb-1">Collection Name</label>
              <input type="text" defaultValue="pollutant_knowledge_v1" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200" />
           </div>
        </ConfigSection>

        <ConfigSection title="索引参数" icon={Settings2}>
           <div>
              <label className="block text-xs text-slate-500 mb-1">Index Type</label>
              <select className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200">
                 <option>IVF_FLAT</option>
                 <option>IVF_SQ8</option>
                 <option>HNSW (Recommended)</option>
              </select>
           </div>
           <div className="mt-2">
              <label className="block text-xs text-slate-500 mb-1">Metric Type</label>
              <select className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200">
                 <option>L2 (Euclidean)</option>
                 <option>IP (Inner Product)</option>
                 <option>COSINE</option>
              </select>
           </div>
        </ConfigSection>

        <MCPSelector label="向量写入器" category="数据检索" />
     </div>
  );

  // 10. Sink: KG
  const renderKGConfig = () => (
     <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-300">
        <ConfigSection title="图数据库 (NebulaGraph)" icon={Share2}>
           <div className="space-y-3">
              <input type="text" placeholder="Graph Space Name" defaultValue="pollutants" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs text-slate-200" />
              <div className="grid grid-cols-2 gap-3">
                 <input type="text" placeholder="User" defaultValue="root" className="bg-slate-900 border border-slate-600 rounded p-2 text-xs" />
                 <input type="password" placeholder="Pwd" defaultValue="*****" className="bg-slate-900 border border-slate-600 rounded p-2 text-xs" />
              </div>
           </div>
        </ConfigSection>

        <ConfigSection title="本体映射 (Ontology)" icon={Network}>
           <div className="bg-slate-900/50 rounded border border-slate-700 p-2 space-y-2">
              <div className="flex items-center gap-2 text-[10px]">
                 <div className="bg-blue-900/30 text-blue-300 px-1 rounded">Subject</div>
                 <ArrowRight className="w-3 h-3 text-slate-500" />
                 <div className="text-slate-300">:Tag(name)</div>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                 <div className="bg-purple-900/30 text-purple-300 px-1 rounded">Predicate</div>
                 <ArrowRight className="w-3 h-3 text-slate-500" />
                 <div className="text-slate-300">-[RELATION]-></div>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                 <div className="bg-green-900/30 text-green-300 px-1 rounded">Object</div>
                 <ArrowRight className="w-3 h-3 text-slate-500" />
                 <div className="text-slate-300">:Entity(id)</div>
              </div>
           </div>
           <button className="w-full mt-2 text-[10px] text-blue-400 border border-blue-900/50 bg-blue-900/10 py-1 rounded hover:bg-blue-900/20">
              Open Schema Editor
           </button>
        </ConfigSection>

        <MCPSelector label="图谱写入器" category="知识查询" />
     </div>
  );

  // --- Palette Item Handler ---
  const handlePaletteClick = (type: OperatorType) => {
    setSelectedNodeId(null); // Deselect canvas node
    setPreviewOperator(type); // Set preview mode
  };

  const renderPaletteItem = (label: string, icon: any, type: OperatorType, colorClass: string) => (
    <div 
      onClick={() => handlePaletteClick(type)}
      className={`flex items-center gap-2 px-2 py-2 rounded cursor-pointer text-xs text-slate-300 transition-all border border-transparent 
        ${previewOperator === type ? 'bg-slate-700 border-slate-500 text-white' : 'hover:bg-slate-700 hover:border-slate-600'}
      `}
    >
       {React.createElement(icon, { className: `w-3.5 h-3.5 ${colorClass}` })} {label}
    </div>
  );

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-1 overflow-hidden gap-0 bg-slate-900 border border-slate-700 rounded-lg">
          
          {/* 1. Left: Operator Palette */}
          <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col shrink-0">
             <div className="p-3 border-b border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <GripVertical className="w-3.5 h-3.5" /> 算子库 (Operators)
             </div>
             <div className="p-3 space-y-4 overflow-y-auto custom-scrollbar">
                <div>
                   <div className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-wider">I/O & Source</div>
                   <div className="space-y-1">
                      {renderPaletteItem('结构化数据 (JDBC)', Database, 'source_jdbc', 'text-blue-400')}
                      {renderPaletteItem('对象存储 (S3)', FileJson, 'source_s3', 'text-yellow-400')}
                      {renderPaletteItem('知识图谱写入', Share2, 'sink_kg', 'text-pink-400')}
                      {renderPaletteItem('向量库写入', HardDrive, 'sink_vec', 'text-green-400')}
                   </div>
                </div>
                <div>
                   <div className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-wider">Transform</div>
                   <div className="space-y-1">
                      {renderPaletteItem('字段映射 (Mapping)', TableProperties, 'trans_mapping', 'text-purple-400')}
                      {renderPaletteItem('Python 脚本', Code, 'trans_python', 'text-pink-400')}
                      {renderPaletteItem('OCR 提取', FileText, 'trans_ocr', 'text-cyan-400')}
                      {renderPaletteItem('智能清洗 (LLM)', Wand2, 'trans_llm', 'text-orange-400')}
                   </div>
                </div>
                <div>
                   <div className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-wider">AI Model</div>
                   <div className="space-y-1">
                      {renderPaletteItem('文本向量化', Layers, 'model_embedding', 'text-blue-400')}
                      {renderPaletteItem('实体关系抽取', Network, 'model_ner', 'text-indigo-400')}
                   </div>
                </div>
             </div>
          </div>

          {/* 2. Center: Canvas */}
          <div 
             className="flex-1 bg-slate-900 relative overflow-auto bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-opacity-20"
             onClick={() => { setSelectedNodeId(null); setPreviewOperator(null); }}
          >
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
                      onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); setPreviewOperator(null); }}
                      style={{ left: node.x, top: node.y }}
                      className={`absolute w-40 p-3 rounded-lg border shadow-lg cursor-pointer transition-all hover:scale-105 z-10 flex flex-col gap-2 ${
                         selectedNodeId === node.id 
                           ? 'bg-slate-800 border-blue-500 ring-2 ring-blue-500/50 shadow-blue-900/50' 
                           : 'bg-slate-800 border-slate-600 hover:border-slate-500'
                      }`}
                   >
                      <div className="flex items-center gap-2">
                         <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                            node.type.startsWith('source') ? 'bg-blue-900/50 text-blue-400' :
                            node.type.startsWith('trans') ? 'bg-purple-900/50 text-purple-400' :
                            node.type === 'trans_python' ? 'bg-pink-900/50 text-pink-400' :
                            node.type.startsWith('model') ? 'bg-indigo-900/50 text-indigo-400' :
                            'bg-green-900/50 text-green-400'
                         }`}>
                            {node.type === 'source_s3' && <FileJson className="w-3.5 h-3.5" />}
                            {node.type === 'trans_ocr' && <Table className="w-3.5 h-3.5" />}
                            {node.type === 'trans_python' && <Code className="w-3.5 h-3.5" />}
                            {node.type === 'model_embedding' && <Layers className="w-3.5 h-3.5" />}
                            {node.type === 'sink_vec' && <Database className="w-3.5 h-3.5" />}
                         </div>
                         <div className="flex flex-col overflow-hidden">
                            <div className="text-[10px] text-slate-500 uppercase font-bold leading-none mb-0.5">{node.type.split('_')[0]}</div>
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
                   <h3 className="text-sm font-bold text-slate-100 truncate">{activeLabel}</h3>
                   <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                      {selectedNodeId && <span className="bg-slate-900 px-1.5 rounded">ID: {selectedNodeId}</span>}
                      {activeType && <span>Type: {activeType}</span>}
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
                {activeType === 'source_s3' && renderS3Config()}
                {activeType === 'source_jdbc' && renderJDBCConfig()}
                
                {activeType === 'trans_ocr' && renderOCRConfig()}
                {activeType === 'trans_mapping' && renderMappingConfig()}
                {activeType === 'trans_python' && renderPythonConfig()}
                {activeType === 'trans_llm' && renderLLMConfig()}
                
                {activeType === 'model_embedding' && renderEmbeddingConfig()}
                {activeType === 'model_ner' && renderNERConfig()}
                
                {activeType === 'sink_vec' && renderVectorDBConfig()}
                {activeType === 'sink_kg' && renderKGConfig()}

                {!activeType && (
                   <div className="h-full flex flex-col items-center justify-center text-slate-600">
                      <MousePointer2 className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-center">请在左侧点击算子或在画布中选择节点<br/>进行工作流配置与 MCP 绑定</p>
                   </div>
                )}
             </div>

             {/* Footer Status */}
             <div className="h-10 border-t border-slate-700 bg-slate-800 flex items-center justify-between px-4 text-[10px] text-slate-500 shrink-0">
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${activeType ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                   Node Service: {activeType ? 'Ready' : 'Idle'}
                </div>
                {selectedNodeId && (
                   <button className="flex items-center gap-1 hover:text-white transition-colors">
                      <Save className="w-3 h-3" /> Save Config
                   </button>
                )}
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