import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Settings, Database, Cpu, FlaskConical, Play, Save, GripHorizontal, ArrowRight, Beaker, FileDigit, Trash2, MousePointer2, Check, ChevronDown } from 'lucide-react';
import { WorkflowNode, WorkflowEdge, NodeConfig } from '../../types';

// --- Mock Options for Configuration ---
const PRESETS = {
  devices: ['Q-TOF MS (高分辨质谱)', 'Auto-SPE (固相萃取)', 'LC-MS/MS (三重四极杆)', '微流控毒性芯片', '光化学反应釜', '离心机 (Centrifuge)', '恒温振荡器'],
  algorithms: ['NTS Peak Picking v3', 'StructureID-Pro (RenDu)', 'RiskEval-AI (DeepSeek)', 'QSAR-Tox-Predict', 'Meta-Frag', 'Retension Time Predictor', 'Isotope Pattern Scorer'],
  dataSources: ['长江流域监测库 (2024)', '饮用水源地基线数据', 'PubChem 镜像库', 'EPA ToxCast', '上传的本地批次', '实时传感器流 (IoT)', '历史实验归档'],
  materials: ['甲醇 (Methanol)', '乙腈 (Acetonitrile)', '固相萃取柱 (HLB)', '斑马鱼胚胎', '质谱调谐液'],
};

// --- Helper Components ---

const MultiSelect = ({ options, value, onChange, placeholder }: { 
  options: string[], 
  value: string | string[] | undefined, 
  onChange: (val: string[]) => void, 
  placeholder: string 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure value is array
  const selected = Array.isArray(value) ? value : (value ? [value] : []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSelection = (option: string) => {
    const newSelection = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelection);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div 
        className="w-full bg-slate-800 border border-slate-600 rounded text-xs p-2 text-slate-200 min-h-[34px] cursor-pointer flex flex-wrap gap-1 items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length === 0 && <span className="text-slate-500 italic">{placeholder}</span>}
        {selected.map(item => (
          <span key={item} className="bg-blue-600/30 text-blue-200 px-1.5 py-0.5 rounded border border-blue-500/30 flex items-center gap-1 leading-none animate-in fade-in zoom-in duration-200">
            {item}
            <X className="w-3 h-3 hover:text-white cursor-pointer" onClick={(e) => {
              e.stopPropagation();
              toggleSelection(item);
            }}/>
          </span>
        ))}
        <div className="ml-auto flex items-center pl-1">
           <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded shadow-xl z-50 max-h-48 overflow-y-auto custom-scrollbar">
          {options.map(opt => (
            <div 
              key={opt}
              className={`px-3 py-2 text-xs cursor-pointer flex items-center gap-2 hover:bg-slate-700/80 transition-colors ${selected.includes(opt) ? 'bg-slate-700/50 text-blue-400 font-medium' : 'text-slate-300'}`}
              onClick={() => toggleSelection(opt)}
            >
              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${selected.includes(opt) ? 'bg-blue-600 border-blue-600' : 'border-slate-500 bg-slate-900'}`}>
                {selected.includes(opt) && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const NewTask: React.FC = () => {
  const [taskName, setTaskName] = useState('新污染物筛查任务_20240521');
  
  // Canvas State
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: '1', label: '样品自动化采集', type: 'process', status: 'pending', x: 100, y: 150, config: { device: ['Auto-SPE (固相萃取)'], inputType: 'physical_sample' } }
  ]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  
  // Interaction State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isDraggingNode, setIsDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingSource, setConnectingSource] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  // --- Handlers ---

  // 1. Drag New Node from Sidebar
  const handleDragStartFromSidebar = (e: React.DragEvent, type: WorkflowNode['type'], label: string) => {
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.setData('nodeLabel', label);
  };

  const handleDropOnCanvas = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('nodeType') as WorkflowNode['type'];
    const label = e.dataTransfer.getData('nodeLabel');
    
    if (type && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 80; // center roughly
      const y = e.clientY - rect.top - 40;
      
      const newNode: WorkflowNode = {
        id: Date.now().toString(),
        label,
        type,
        status: 'pending',
        x,
        y,
        config: {
          name: label,
          params: {}
        }
      };
      setNodes([...nodes, newNode]);
      setSelectedNodeId(newNode.id);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  // 2. Move Existing Node
  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === id);
    if (node) {
      setIsDraggingNode(id);
      setSelectedNodeId(id);
      // Calculate offset within the node
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (canvasRef.current) {
       const rect = canvasRef.current.getBoundingClientRect();
       setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

       if (isDraggingNode) {
         const newX = e.clientX - rect.left - dragOffset.x;
         const newY = e.clientY - rect.top - dragOffset.y;
         setNodes(nodes.map(n => n.id === isDraggingNode ? { ...n, x: newX, y: newY } : n));
       }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingNode(null);
    setConnectingSource(null);
  };

  // 3. Create Connections
  const handlePortMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation(); // Don't drag node
    setConnectingSource(nodeId);
  };

  const handlePortMouseUp = (e: React.MouseEvent, targetId: string) => {
    e.stopPropagation();
    if (connectingSource && connectingSource !== targetId) {
      // Check if connection exists
      if (!edges.find(edge => edge.from === connectingSource && edge.to === targetId)) {
        const newEdge: WorkflowEdge = {
          id: `${connectingSource}-${targetId}`,
          from: connectingSource,
          to: targetId
        };
        setEdges([...edges, newEdge]);
      }
    }
    setConnectingSource(null);
  };

  // 4. Update Configuration
  const updateConfig = (key: keyof NodeConfig, value: any) => {
    if (!selectedNodeId) return;
    setNodes(nodes.map(n => 
      n.id === selectedNodeId 
      ? { ...n, config: { ...n.config, [key]: value } } 
      : n
    ));
  };

  const updateParam = (key: string, value: string) => {
    if (!selectedNodeId) return;
    setNodes(nodes.map(n => {
      if (n.id === selectedNodeId) {
        return { 
          ...n, 
          config: { 
            ...n.config, 
            params: { ...n.config.params, [key]: value } 
          } 
        };
      }
      return n;
    }));
  };

  const addMaterial = () => {
    if (!selectedNodeId) return;
    setNodes(nodes.map(n => {
      if (n.id === selectedNodeId) {
        const mats = n.config.materials || [];
        return {
          ...n,
          config: {
            ...n.config,
            materials: [...mats, { name: PRESETS.materials[0], amount: '1', unit: 'ml' }]
          }
        };
      }
      return n;
    }));
  };

  const deleteNode = (id: string) => {
     setNodes(nodes.filter(n => n.id !== id));
     setEdges(edges.filter(e => e.from !== id && e.to !== id));
     if(selectedNodeId === id) setSelectedNodeId(null);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="h-full flex flex-col bg-slate-900" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* 1. Header */}
      <div className="h-16 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-900 shrink-0 z-20">
        <div className="flex items-center gap-4 w-1/2">
           <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center font-bold text-white">N</div>
           <div className="flex-1">
             <label className="text-[10px] text-slate-500 uppercase font-bold">任务名称</label>
             <input 
               type="text" 
               value={taskName}
               onChange={(e) => setTaskName(e.target.value)}
               className="w-full bg-transparent border-none p-0 text-slate-200 font-semibold focus:ring-0 placeholder-slate-600"
               placeholder="输入任务名称..."
             />
           </div>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-colors border border-slate-600 text-sm">
             <Save className="w-4 h-4" /> 保存方案
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/50 text-sm">
             <Play className="w-4 h-4" /> 部署运行
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 2. Left: Toolbox */}
        <div className="w-64 border-r border-slate-700 bg-slate-800/50 flex flex-col z-10">
           <div className="p-4 border-b border-slate-700">
             <h3 className="text-sm font-bold text-slate-200">组件库</h3>
             <p className="text-xs text-slate-500 mt-1">拖拽组件至画布以构建流程</p>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                  <FlaskConical className="w-3.5 h-3.5" /> 物理实验节点
                </h4>
                <div className="space-y-2">
                   {['样品采集', '固相萃取 (SPE)', '仪器进样 (Injection)', '生物毒性暴露'].map(label => (
                     <div 
                       key={label}
                       draggable 
                       onDragStart={(e) => handleDragStartFromSidebar(e, 'process', label)}
                       className="p-3 bg-slate-800 border border-slate-700 hover:border-green-500 rounded cursor-grab active:cursor-grabbing text-sm text-slate-300 transition-all flex items-center gap-2 shadow-sm"
                     >
                       <GripHorizontal className="w-4 h-4 text-slate-600" />
                       {label}
                     </div>
                   ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5" /> 智能分析节点
                </h4>
                <div className="space-y-2">
                   {['NTS 数据清洗', '特征峰提取', '结构解析智能体', '风险预测模型', '机理仿真'].map(label => (
                     <div 
                       key={label}
                       draggable 
                       onDragStart={(e) => handleDragStartFromSidebar(e, 'ai_analysis', label)}
                       className="p-3 bg-slate-800 border border-slate-700 hover:border-purple-500 rounded cursor-grab active:cursor-grabbing text-sm text-slate-300 transition-all flex items-center gap-2 shadow-sm"
                     >
                       <GripHorizontal className="w-4 h-4 text-slate-600" />
                       {label}
                     </div>
                   ))}
                </div>
              </div>

               <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5" /> 决策与控制
                </h4>
                <div className="space-y-2">
                   {['人工复核', '条件分支', '报告生成'].map(label => (
                     <div 
                       key={label}
                       draggable 
                       onDragStart={(e) => handleDragStartFromSidebar(e, 'decision', label)}
                       className="p-3 bg-slate-800 border border-slate-700 hover:border-orange-500 rounded cursor-grab active:cursor-grabbing text-sm text-slate-300 transition-all flex items-center gap-2 shadow-sm"
                     >
                       <GripHorizontal className="w-4 h-4 text-slate-600" />
                       {label}
                     </div>
                   ))}
                </div>
              </div>
           </div>
        </div>

        {/* 3. Center: Canvas */}
        <div 
           ref={canvasRef}
           className="flex-1 bg-slate-900 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/grid-noise.png')]"
           onDragOver={handleDragOver}
           onDrop={handleDropOnCanvas}
        >
           {/* SVG Layer for Edges */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                 <marker id="arrowhead-builder" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                   <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                 </marker>
              </defs>
              {edges.map(edge => {
                 const fromNode = nodes.find(n => n.id === edge.from);
                 const toNode = nodes.find(n => n.id === edge.to);
                 if (!fromNode || !toNode) return null;
                 
                 // Handle offsets (Right side of source, Left side of target)
                 const sx = fromNode.x + 192; // Width of node is w-48 (192px)
                 const sy = fromNode.y + 40;  // Half height approx
                 const tx = toNode.x;
                 const ty = toNode.y + 40;

                 // Bezier Curve
                 const controlPointOffset = Math.abs(tx - sx) / 2;
                 const d = `M ${sx} ${sy} C ${sx + controlPointOffset} ${sy}, ${tx - controlPointOffset} ${ty}, ${tx} ${ty}`;

                 return (
                    <g key={edge.id}>
                       <path d={d} fill="none" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead-builder)" />
                    </g>
                 )
              })}
              {/* Drawing Line (Draft) */}
              {connectingSource && (
                 <line 
                   x1={nodes.find(n => n.id === connectingSource)!.x + 192} 
                   y1={nodes.find(n => n.id === connectingSource)!.y + 40} 
                   x2={mousePos.x} 
                   y2={mousePos.y} 
                   stroke="#3b82f6" 
                   strokeWidth="2" 
                   strokeDasharray="5,5" 
                 />
              )}
           </svg>

           {/* Nodes Layer */}
           {nodes.map(node => (
              <div 
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
                className={`absolute w-48 bg-slate-800 rounded-lg shadow-xl cursor-move transition-shadow group z-10 ${
                  selectedNodeId === node.id ? 'ring-2 ring-blue-500 border-transparent' : 'border border-slate-700 hover:border-slate-500'
                }`}
              >
                 {/* Input Port (Target) */}
                 <div 
                    onMouseUp={(e) => handlePortMouseUp(e, node.id)}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-600 rounded-full border border-slate-400 hover:bg-blue-500 hover:scale-125 transition-all cursor-crosshair z-20"
                    title="Input Port"
                 ></div>

                 {/* Output Port (Source) */}
                 <div 
                    onMouseDown={(e) => handlePortMouseDown(e, node.id)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-600 rounded-full border border-slate-400 hover:bg-blue-500 hover:scale-125 transition-all cursor-crosshair z-20"
                    title="Output Port"
                 ></div>

                 {/* Node Header */}
                 <div className={`h-2 rounded-t-lg w-full ${
                    node.type === 'process' ? 'bg-green-500' : 
                    node.type === 'ai_analysis' ? 'bg-purple-500' : 'bg-orange-500'
                 }`}></div>
                 
                 <div className="p-3">
                    <div className="flex justify-between items-start mb-2">
                       <span className="font-bold text-slate-200 text-sm truncate">{node.label}</span>
                       <button onClick={(e) => { e.stopPropagation(); deleteNode(node.id) }} className="text-slate-500 hover:text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                       </button>
                    </div>
                    <div className="text-[10px] text-slate-500 space-y-1 flex flex-col">
                       {/* Handle Array Display */}
                       {node.config.device && (Array.isArray(node.config.device) ? node.config.device : [node.config.device]).map((d, i) => (
                           <div key={i} className="truncate flex items-center gap-1"><FlaskConical className="w-2.5 h-2.5"/> {d}</div>
                       ))}
                       {node.config.algorithm && (Array.isArray(node.config.algorithm) ? node.config.algorithm : [node.config.algorithm]).map((a, i) => (
                           <div key={i} className="truncate flex items-center gap-1"><Cpu className="w-2.5 h-2.5"/> {a}</div>
                       ))}
                       {!node.config.device && !node.config.algorithm && <div className="italic opacity-40">未配置参数</div>}
                    </div>
                 </div>
              </div>
           ))}
        </div>

        {/* 4. Right: Config Panel (Detailed) */}
        <div className="w-96 bg-slate-800 border-l border-slate-700 flex flex-col overflow-y-auto z-20">
           {selectedNode ? (
             <div className="flex flex-col h-full">
                <div className="p-5 border-b border-slate-700 bg-slate-800/80 backdrop-blur sticky top-0 z-10">
                   <div className="text-xs font-bold text-slate-500 uppercase mb-1">{selectedNode.type === 'process' ? '物理实验节点' : '数字分析节点'}</div>
                   <h3 className="text-lg font-bold text-slate-100">{selectedNode.label}</h3>
                   <div className="text-xs text-slate-500 font-mono mt-1">ID: {selectedNode.id}</div>
                </div>

                <div className="p-5 space-y-8 flex-1">
                   {/* SECTION 1: DATA INPUTS */}
                   <div>
                      <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2 mb-3">
                         <Database className="w-4 h-4" /> 数据与样本源
                      </h4>
                      <div className="space-y-3 bg-slate-900/50 p-3 rounded border border-slate-700">
                         <div>
                            <label className="text-xs text-slate-400 block mb-1">输入源类型</label>
                            <select 
                               value={selectedNode.config.inputType} 
                               onChange={(e) => updateConfig('inputType', e.target.value)}
                               className="w-full bg-slate-800 border border-slate-600 rounded text-xs p-2 text-slate-200"
                            >
                               <option value="physical_sample">实体样本 (Physical Sample)</option>
                               <option value="digital_signal">数字信号 (Raw Data)</option>
                               <option value="spectrum_file">质谱文件 (.RAW/.mzXML)</option>
                            </select>
                         </div>
                         <div>
                            <label className="text-xs text-slate-400 block mb-1">关联批次/数据库 (多选)</label>
                            <MultiSelect 
                               options={PRESETS.dataSources}
                               value={selectedNode.config.dataSource}
                               onChange={(val) => updateConfig('dataSource', val)}
                               placeholder="选择数据源..."
                            />
                         </div>
                      </div>
                   </div>

                   {/* SECTION 2: EXECUTION CONFIG */}
                   <div>
                      <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2 mb-3">
                         <Settings className="w-4 h-4" /> 执行配置
                      </h4>
                      <div className="space-y-3 bg-slate-900/50 p-3 rounded border border-slate-700">
                         {selectedNode.type === 'process' ? (
                            <div>
                               <label className="text-xs text-slate-400 block mb-1">指定实验设备 (多选)</label>
                               <MultiSelect
                                  options={PRESETS.devices}
                                  value={selectedNode.config.device}
                                  onChange={(val) => updateConfig('device', val)}
                                  placeholder="选择设备..."
                               />
                            </div>
                         ) : (
                            <div>
                               <label className="text-xs text-slate-400 block mb-1">核心算法/模型 (多选)</label>
                               <MultiSelect
                                  options={PRESETS.algorithms}
                                  value={selectedNode.config.algorithm}
                                  onChange={(val) => updateConfig('algorithm', val)}
                                  placeholder="选择算法..."
                               />
                            </div>
                         )}

                         <div className="pt-2 border-t border-slate-700">
                            <label className="text-xs text-slate-400 block mb-2">运行参数 (Parameters)</label>
                            <div className="space-y-2">
                               <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500 w-20">{selectedNode.type === 'process' ? '流速/温度' : '阈值/Conf'}</span>
                                  <input 
                                     type="text" 
                                     className="flex-1 bg-slate-800 border border-slate-600 rounded text-xs p-1.5 text-slate-200"
                                     placeholder="Value..."
                                     value={(selectedNode.config.params?.param1 as string) || ''}
                                     onChange={(e) => updateParam('param1', e.target.value)}
                                  />
                               </div>
                               <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500 w-20">{selectedNode.type === 'process' ? '持续时间' : 'Max Epochs'}</span>
                                  <input 
                                     type="text" 
                                     className="flex-1 bg-slate-800 border border-slate-600 rounded text-xs p-1.5 text-slate-200"
                                     placeholder="Value..."
                                     value={(selectedNode.config.params?.param2 as string) || ''}
                                     onChange={(e) => updateParam('param2', e.target.value)}
                                  />
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* SECTION 3: MATERIALS / RESOURCES (Only for Physical) */}
                   {selectedNode.type === 'process' && (
                      <div>
                         <h4 className="text-sm font-bold text-green-400 flex items-center gap-2 mb-3">
                            <Beaker className="w-4 h-4" /> 物料与耗材
                         </h4>
                         <div className="bg-slate-900/50 p-3 rounded border border-slate-700 space-y-2">
                            {selectedNode.config.materials?.map((mat, idx) => (
                               <div key={idx} className="flex gap-2 items-center text-xs">
                                  <div className="flex-1 bg-slate-800 p-1.5 rounded border border-slate-600 truncate">{mat.name}</div>
                                  <div className="w-12 bg-slate-800 p-1.5 rounded border border-slate-600 text-center">{mat.amount}</div>
                                  <div className="w-10 text-slate-500">{mat.unit}</div>
                                  <button className="text-slate-500 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                               </div>
                            ))}
                            <button 
                               onClick={addMaterial}
                               className="w-full py-1.5 border border-dashed border-slate-600 rounded text-xs text-slate-500 hover:text-white hover:border-slate-400 flex items-center justify-center gap-1"
                            >
                               <Plus className="w-3 h-3" /> 添加试剂/耗材
                            </button>
                         </div>
                      </div>
                   )}

                   {/* SECTION 4: OUTPUTS */}
                   <div>
                      <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2 mb-3">
                         <ArrowRight className="w-4 h-4" /> 预期产出
                      </h4>
                      <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                         <label className="text-xs text-slate-400 block mb-1">产物类型</label>
                         <div className="flex gap-2 text-xs">
                            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-600 text-slate-300">
                               {selectedNode.type === 'process' ? 'Physical Sample (ID)' : 'JSON / Report'}
                            </span>
                         </div>
                      </div>
                   </div>

                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6 text-center space-y-4">
               <MousePointer2 className="w-12 h-12 opacity-20" />
               <p>请选择画布中的节点<br/>进行详细参数配置</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default NewTask;