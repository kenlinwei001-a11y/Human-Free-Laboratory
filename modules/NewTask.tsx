import React, { useState } from 'react';
import { Plus, FolderKanban, Play, CheckCircle2, Clock, AlertOctagon, ArrowRight, Target, Database, FlaskConical, X, Save, Bot, Workflow, Settings2, Trash2, Cpu, Server, GitFork } from 'lucide-react';
import { ResearchTask } from '../../types';

// Mock Data Resources
const DATA_SOURCES = [
  { id: 'ds1', name: 'Q-TOF MS 实时流 (Stream-01)', type: 'stream', size: 'Real-time' },
  { id: 'ds2', name: '长江口定点采样数据_202405.csv', type: 'file', size: '450MB' },
  { id: 'ds3', name: '历史非靶向筛查库 (LIMS-DB)', type: 'db', size: '12TB' },
  { id: 'ds4', name: 'EPA ToxCast 离线库', type: 'db', size: '2.4GB' },
];

// Mock Agents
const AGENTS = [
  { id: 'ag1', name: '新污染物发现智能体', role: 'Discovery', desc: '负责NTS数据特征提取' },
  { id: 'ag2', name: '结构解析智能体', role: 'Analysis', desc: '负责分子式与结构推断' },
  { id: 'ag3', name: '风险评估智能体', role: 'Risk', desc: '负责毒性预测与法规比对' },
  { id: 'ag4', name: '实验调度智能体', role: 'Control', desc: '负责设备指令下发' },
];

// Mock Tools/Devices for Workflow
const RESOURCES = {
  device: [
    { id: 'dev1', name: 'Auto-Sampler (自动进样器)' },
    { id: 'dev2', name: 'Q-TOF MS (高分辨质谱)' },
    { id: 'dev3', name: 'Auto-SPE (固相萃取仪)' },
    { id: 'dev4', name: '微流控毒性芯片' },
  ],
  algorithm: [
    { id: 'alg1', name: 'NTS-PeakPick (峰提取算法)' },
    { id: 'alg2', name: 'RenDu-Chem (结构解析模型)' },
    { id: 'alg3', name: 'QSAR-Tox (毒性预测模型)' },
    { id: 'alg4', name: 'AOP-Sim (高级氧化仿真)' },
  ]
};

// Initial Tasks (Keep existing)
const initialTasks: ResearchTask[] = [
  {
    id: 'Task-2024-X09',
    name: '长江流域典型抗生素替代品筛查',
    priority: 'High',
    stage: 'structure_id',
    stageLabel: '结构解析与确证',
    progress: 45,
    status: 'running',
    startTime: '2024-05-20 08:30',
    estimatedEndTime: '2024-05-21 14:00',
    owner: 'Dr. Li'
  },
  {
    id: 'Task-2024-Y12',
    name: '新型全氟化合物(PFASs)光降解机理研究',
    priority: 'Medium',
    stage: 'governance_sim',
    stageLabel: '光解路径仿真模拟',
    progress: 78,
    status: 'running',
    startTime: '2024-05-19 10:00',
    estimatedEndTime: '2024-05-20 18:00',
    owner: 'AI Agent-03'
  },
  {
    id: 'Task-2024-Z05',
    name: '饮用水源地微囊藻毒素变异体监测',
    priority: 'High',
    stage: 'nts_screening',
    stageLabel: '非靶向筛查数据清洗',
    progress: 12,
    status: 'error',
    startTime: '2024-05-20 13:15',
    estimatedEndTime: 'Unknown',
    owner: 'Auto-Sampler'
  }
];

interface WorkflowNodeData {
  id: string;
  name: string;
  type: 'device' | 'algorithm';
  resourceId: string;
  inputData?: string;
}

const ProjectManagement: React.FC = () => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [tasks, setTasks] = useState<ResearchTask[]>(initialTasks);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    mediums: [] as string[],
    selectedDataSources: [] as string[],
    selectedAgents: [] as string[],
  });

  // Workflow Builder State
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNodeData[]>([]);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [newNode, setNewNode] = useState<Partial<WorkflowNodeData>>({ type: 'device' });

  // --- Handlers ---

  const handleMediumToggle = (medium: string) => {
    setFormData(prev => {
      const exists = prev.mediums.includes(medium);
      return {
        ...prev,
        mediums: exists ? prev.mediums.filter(m => m !== medium) : [...prev.mediums, medium]
      };
    });
  };

  const toggleSelection = (listKey: 'selectedDataSources' | 'selectedAgents', id: string) => {
    setFormData(prev => {
      const list = prev[listKey];
      const exists = list.includes(id);
      return {
        ...prev,
        [listKey]: exists ? list.filter(item => item !== id) : [...list, id]
      };
    });
  };

  const handleAddNode = () => {
    if (!newNode.name || !newNode.resourceId) return;
    const node: WorkflowNodeData = {
      id: `node-${Date.now()}`,
      name: newNode.name,
      type: newNode.type as 'device' | 'algorithm',
      resourceId: newNode.resourceId,
      inputData: newNode.inputData
    };
    setWorkflowNodes([...workflowNodes, node]);
    setIsAddingNode(false);
    setNewNode({ type: 'device' });
  };

  const removeNode = (id: string) => {
    setWorkflowNodes(workflowNodes.filter(n => n.id !== id));
  };

  const handleCreateTask = () => {
    if (!formData.name) return;

    const newTask: ResearchTask = {
      id: `Task-2024-${Math.floor(Math.random() * 1000 + 1000)}`,
      name: formData.name,
      priority: formData.priority,
      stage: 'sample_prep',
      stageLabel: '初始化流程',
      progress: 0,
      status: 'queued',
      startTime: new Date().toLocaleString('zh-CN', { hour12: false }),
      estimatedEndTime: '计算中...',
      owner: '当前用户'
    };

    setTasks([newTask, ...tasks]);
    setView('list');
    
    // Reset
    setFormData({
      name: '',
      priority: 'Medium',
      mediums: [],
      selectedDataSources: [],
      selectedAgents: [],
    });
    setWorkflowNodes([]);
  };

  const TaskStatusBadge = ({ status }: { status: ResearchTask['status'] }) => {
    switch (status) {
      case 'running': return <span className="flex items-center gap-1 text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded text-[10px] border border-blue-800"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>进行中</span>;
      case 'completed': return <span className="text-green-400 bg-green-900/30 px-2 py-0.5 rounded text-[10px] border border-green-800">已完成</span>;
      case 'error': return <span className="text-red-400 bg-red-900/30 px-2 py-0.5 rounded text-[10px] border border-red-800">异常</span>;
      case 'queued': return <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-[10px] border border-slate-700">排队中</span>;
      default: return <span className="text-slate-500 bg-slate-900 px-2 py-0.5 rounded text-[10px] border border-slate-800">未知</span>;
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
       <div className="flex justify-between items-start shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-blue-500" />
            项目管理 (Project Management)
          </h2>
          <p className="text-sm text-slate-400">统一管理无人实验室的科研项目，定义目标、资源与实验流程。</p>
        </div>
        <div className="flex gap-3">
           {view === 'create' && (
             <button onClick={() => setView('list')} className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 text-sm flex items-center gap-2">
               <X className="w-4 h-4" /> 取消
             </button>
           )}
           {view === 'list' && (
             <button 
               onClick={() => setView('create')}
               className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium transition-colors shadow-lg shadow-blue-900/50"
             >
                <Plus className="w-4 h-4" /> 新建项目
             </button>
           )}
        </div>
      </div>

      {view === 'list' ? (
        <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex flex-col animate-in fade-in duration-300">
           {/* Task List Header */}
           <div className="p-4 border-b border-slate-700 flex gap-4 text-sm text-slate-400 font-medium bg-slate-800/50">
              <div className="flex-1">项目名称 / ID</div>
              <div className="w-40">当前阶段</div>
              <div className="w-32">进度</div>
              <div className="w-24">状态</div>
              <div className="w-40">负责人</div>
              <div className="w-24 text-right">操作</div>
           </div>
           {/* Task List Body */}
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              {tasks.map(task => (
                <div key={task.id} className="p-4 border-b border-slate-700/50 flex gap-4 items-center hover:bg-slate-700/20 transition-colors group cursor-pointer">
                   <div className="flex-1">
                      <div className="text-slate-200 font-medium group-hover:text-blue-400 transition-colors">{task.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{task.id}</div>
                   </div>
                   <div className="w-40 text-xs text-slate-300 flex flex-col justify-center">
                     <span>{task.stageLabel}</span>
                     {task.priority === 'High' && <span className="text-[10px] text-orange-400 font-bold mt-0.5">HIGH PRIORITY</span>}
                   </div>
                   <div className="w-32 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                         <div className={`h-full rounded-full ${task.status === 'error' ? 'bg-red-500' : task.status === 'queued' ? 'bg-slate-500' : 'bg-blue-500'}`} style={{width: `${task.progress}%`}}></div>
                      </div>
                      <span className="text-[10px] text-slate-500 w-6 text-right">{task.progress}%</span>
                   </div>
                   <div className="w-24"><TaskStatusBadge status={task.status} /></div>
                   <div className="w-40 text-xs text-slate-400 flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                        {task.owner.charAt(0)}
                      </div>
                      {task.owner}
                   </div>
                   <div className="w-24 text-right">
                      <button className="p-1.5 hover:bg-slate-700 rounded text-slate-500 hover:text-white transition-colors">
                         <ArrowRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      ) : (
        <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-8 overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-300">
           <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Step 1: Definition */}
              <div>
                 <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" /> 1. 定义项目目标 (Project Definition)
                 </h3>
                 <div className="space-y-4 bg-slate-900/30 p-5 rounded-lg border border-slate-700/50">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2">
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">项目名称 <span className="text-red-500">*</span></label>
                         <input 
                           type="text" 
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           className="w-full bg-slate-900 border border-slate-600 rounded p-2.5 text-sm text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-slate-600" 
                           placeholder="例如：2024 夏季长江口新污染物普查" 
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">优先级</label>
                         <div className="flex gap-4">
                            {['Low', 'Medium', 'High'].map(p => (
                               <label key={p} className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                    type="radio" 
                                    name="priority" 
                                    checked={formData.priority === p} 
                                    onChange={() => setFormData({...formData, priority: p as any})}
                                    className="accent-blue-500" 
                                  />
                                  <span className={`text-sm ${formData.priority === p ? 'text-blue-400 font-bold' : 'text-slate-400'}`}>{p}</span>
                               </label>
                            ))}
                         </div>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">研究介质</label>
                         <div className="flex gap-3 flex-wrap">
                            {['地表水', '地下水', '土壤', '生物样本', '大气沉降'].map(t => (
                               <label 
                                 key={t} 
                                 className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                                   formData.mediums.includes(t) 
                                     ? 'bg-blue-600/20 border-blue-500 text-blue-200' 
                                     : 'bg-slate-900/50 border-slate-600 text-slate-400 hover:bg-slate-700'
                                 }`}
                               >
                                  <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={formData.mediums.includes(t)}
                                    onChange={() => handleMediumToggle(t)}
                                  />
                                  <span className="text-xs">{t}</span>
                               </label>
                            ))}
                         </div>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Step 2: Data Source */}
              <div>
                 <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-400" /> 2. 绑定数据资源 (Data Binding)
                 </h3>
                 <div className="bg-slate-900/30 p-5 rounded-lg border border-slate-700/50">
                    <div className="grid grid-cols-2 gap-4">
                       {DATA_SOURCES.map(ds => (
                          <div 
                             key={ds.id}
                             onClick={() => toggleSelection('selectedDataSources', ds.id)}
                             className={`p-3 rounded border cursor-pointer flex items-center justify-between transition-all ${
                                formData.selectedDataSources.includes(ds.id)
                                  ? 'bg-purple-900/20 border-purple-500 text-purple-200'
                                  : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                             }`}
                          >
                             <div>
                                <div className="text-sm font-medium flex items-center gap-2">
                                  {ds.type === 'stream' && <Clock className="w-3 h-3" />}
                                  {ds.type === 'db' && <Database className="w-3 h-3" />}
                                  {ds.type === 'file' && <Server className="w-3 h-3" />}
                                  {ds.name}
                                </div>
                                <div className="text-xs opacity-60 mt-0.5">{ds.type.toUpperCase()} • {ds.size}</div>
                             </div>
                             {formData.selectedDataSources.includes(ds.id) && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Step 3: Agent Selection */}
              <div>
                 <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-green-400" /> 3. 编排智能体团队 (Agent Team)
                 </h3>
                 <div className="bg-slate-900/30 p-5 rounded-lg border border-slate-700/50">
                    <div className="grid grid-cols-2 gap-4">
                       {AGENTS.map(agent => (
                          <div 
                             key={agent.id}
                             onClick={() => toggleSelection('selectedAgents', agent.id)}
                             className={`p-3 rounded border cursor-pointer flex items-center justify-between transition-all ${
                                formData.selectedAgents.includes(agent.id)
                                  ? 'bg-green-900/20 border-green-500 text-green-200'
                                  : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                             }`}
                          >
                             <div>
                                <div className="text-sm font-medium">{agent.name}</div>
                                <div className="text-xs opacity-60 mt-0.5">{agent.desc}</div>
                             </div>
                             {formData.selectedAgents.includes(agent.id) && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Step 4: Low Code Workflow Builder */}
              <div>
                 <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                    <GitFork className="w-5 h-5 text-orange-400" /> 4. 低代码工作流配置 (Low-Code Workflow)
                 </h3>
                 <div className="bg-slate-900/30 p-6 rounded-lg border border-slate-700/50 space-y-6">
                    
                    <div className="bg-slate-800/50 p-4 rounded border border-slate-700/30 text-xs text-slate-400">
                       <span className="text-orange-400 font-bold">配置模式：</span> 拖拽节点或点击下方按钮，组装物理实验与数字推演的混合流程。
                    </div>

                    {/* Visual Workflow Chain */}
                    <div className="flex flex-wrap items-center gap-4 min-h-[100px]">
                       {workflowNodes.length === 0 && (
                          <div className="w-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl p-8 bg-slate-800/20">
                             <Workflow className="w-8 h-8 mb-2 opacity-50" />
                             <p className="text-sm font-medium">流程画布为空</p>
                             <p className="text-xs mt-1">请添加节点以定义实验步骤</p>
                          </div>
                       )}
                       
                       {workflowNodes.map((node, index) => (
                          <div key={node.id} className="flex items-center gap-2 group animate-in zoom-in-50 duration-300">
                             <div className="relative bg-slate-800 border border-slate-600 p-3 rounded-lg min-w-[150px] shadow-lg hover:border-blue-500 transition-all hover:shadow-blue-900/20">
                                <button 
                                   onClick={() => removeNode(node.id)}
                                   className="absolute -top-2 -right-2 bg-slate-700 text-slate-400 rounded-full p-1 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                   <X className="w-3 h-3" />
                                </button>
                                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-300">
                                   <div className={`p-1.5 rounded ${node.type === 'device' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                      {node.type === 'device' ? <FlaskConical className="w-3 h-3" /> : <Cpu className="w-3 h-3" />}
                                   </div>
                                   <span className="truncate max-w-[100px]">{node.name}</span>
                                </div>
                                <div className="text-[10px] text-slate-500 truncate pl-1 border-l-2 border-slate-700">
                                   {node.type === 'device' 
                                      ? RESOURCES.device.find(r => r.id === node.resourceId)?.name 
                                      : RESOURCES.algorithm.find(r => r.id === node.resourceId)?.name}
                                </div>
                             </div>
                             {index < workflowNodes.length - 1 && <ArrowRight className="w-5 h-5 text-slate-600" />}
                          </div>
                       ))}
                    </div>

                    {/* Add Node Panel */}
                    {!isAddingNode ? (
                       <button 
                         onClick={() => setIsAddingNode(true)}
                         className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 hover:border-blue-500 hover:text-blue-400 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                       >
                          <Plus className="w-5 h-5" /> 添加流程节点
                       </button>
                    ) : (
                       <div className="bg-slate-800 p-5 rounded-xl border border-slate-600 animate-in fade-in zoom-in-95 duration-200 shadow-xl">
                          <h4 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
                             <span>配置新节点</span>
                             <button onClick={() => setIsAddingNode(false)}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                             <div className="md:col-span-2">
                                <label className="block text-xs text-slate-400 mb-1.5">节点名称</label>
                                <input 
                                  type="text" 
                                  className="w-full bg-slate-900 border border-slate-600 rounded p-2.5 text-xs text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
                                  placeholder="例如：样品前处理"
                                  value={newNode.name || ''}
                                  onChange={e => setNewNode({...newNode, name: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="block text-xs text-slate-400 mb-1.5">节点类型</label>
                                <div className="flex bg-slate-900 rounded border border-slate-600 p-1">
                                   <button 
                                      onClick={() => setNewNode({...newNode, type: 'device', resourceId: ''})}
                                      className={`flex-1 py-1.5 text-xs rounded transition-colors ${newNode.type === 'device' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                                   >物理实验</button>
                                   <button 
                                      onClick={() => setNewNode({...newNode, type: 'algorithm', resourceId: ''})}
                                      className={`flex-1 py-1.5 text-xs rounded transition-colors ${newNode.type === 'algorithm' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                                   >数字推演</button>
                                </div>
                             </div>
                             <div>
                                <label className="block text-xs text-slate-400 mb-1.5">
                                   {newNode.type === 'device' ? '选择实验设备' : '选择算法/模型'}
                                </label>
                                <select 
                                   className="w-full bg-slate-900 border border-slate-600 rounded p-2.5 text-xs text-slate-200 outline-none focus:ring-1 focus:ring-blue-500"
                                   value={newNode.resourceId || ''}
                                   onChange={e => setNewNode({...newNode, resourceId: e.target.value})}
                                >
                                   <option value="">-- 请选择 --</option>
                                   {newNode.type === 'device' 
                                      ? RESOURCES.device.map(r => <option key={r.id} value={r.id}>{r.name}</option>)
                                      : RESOURCES.algorithm.map(r => <option key={r.id} value={r.id}>{r.name}</option>)
                                   }
                                </select>
                             </div>
                             <div className="md:col-span-2">
                                <label className="block text-xs text-slate-400 mb-1.5">输入数据 (Inherited)</label>
                                <select 
                                   className="w-full bg-slate-900 border border-slate-600 rounded p-2.5 text-xs text-slate-200 outline-none"
                                   value={newNode.inputData || ''}
                                   onChange={e => setNewNode({...newNode, inputData: e.target.value})}
                                >
                                   <option value="">(自动继承上一步输出)</option>
                                   {formData.selectedDataSources.map(dsId => {
                                      const ds = DATA_SOURCES.find(d => d.id === dsId);
                                      return ds ? <option key={ds.id} value={ds.id}>{ds.name}</option> : null;
                                   })}
                                </select>
                             </div>
                          </div>
                          <div className="mt-5 flex justify-end">
                             <button 
                                onClick={handleAddNode}
                                disabled={!newNode.name || !newNode.resourceId}
                                className="bg-blue-600 text-white text-xs px-5 py-2.5 rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                             >
                                确认添加节点
                             </button>
                          </div>
                       </div>
                    )}
                 </div>
              </div>

              {/* Action Bar */}
              <div className="pt-6 border-t border-slate-700 flex justify-end gap-3 sticky bottom-0 bg-slate-900/80 backdrop-blur py-4 -mx-4 px-4 z-10">
                 <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" /> 保存草稿
                 </button>
                 <button 
                   onClick={handleCreateTask}
                   disabled={!formData.name}
                   className={`px-6 py-2 text-white rounded text-sm font-bold shadow-lg transition-colors flex items-center gap-2 ${
                     formData.name 
                       ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/50 cursor-pointer' 
                       : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                   }`}
                 >
                    <Play className="w-4 h-4" /> 启动项目
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;