import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Settings, Wind, Zap, Thermometer, Activity, Layers, 
  FlaskConical, Droplets, Plus, X, ArrowRight, Save, Cpu, Box, Workflow, 
  FileCode, Database, CheckCircle2, ChevronRight, BarChart3, Bot
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

// --- MOCK DATA FOR DIGITAL SIMULATION ---

const DIGITAL_NODES = [
  { id: 'dn1', name: '量子化学计算 (DFT)', type: 'quantum', desc: '计算分子能隙 (HOMO-LUMO) 与反应位点', cost: 'High Compute' },
  { id: 'dn2', name: '分子动力学模拟 (MD)', type: 'physics', desc: '模拟污染物在水环境中的扩散行为', cost: 'Medium Compute' },
  { id: 'dn3', name: '反应动力学求解 (Kinetics)', type: 'math', desc: '基于 ODE 求解降解速率方程', cost: 'Low Compute' },
  { id: 'dn4', name: 'QSAR 毒性演变预测', type: 'ai', desc: '预测降解中间产物的毒性变化趋势', cost: 'AI Inference' },
  { id: 'dn5', name: '多物理场耦合 (CFD)', type: 'physics', desc: '模拟反应器内的流体动力学状态', cost: 'High Compute' },
  { id: 'dn6', name: '实验数据拟合验证', type: 'data', desc: '与历史实验数据进行相关性校验', cost: 'Low Compute' },
];

const RECENT_SIMULATIONS = [
  { id: 'SIM-2024-001', name: 'PFOS 光解路径 DFT 计算', status: 'completed', type: '量子化学', owner: 'Dr. Li', date: '2024-05-18' },
  { id: 'SIM-2024-002', name: '长江口抗生素扩散 CFD 模拟', status: 'running', type: '多物理场', owner: 'AI Agent', date: '2024-05-19' },
  { id: 'SIM-2024-003', name: '微囊藻毒素氧化动力学', status: 'draft', type: '动力学', owner: 'Dr. Wang', date: '2024-05-20' },
];

// --- SUB-COMPONENT: SIMULATION RUNNER (The Visualizer) ---

const SimulationRunner = ({ onBack, config }: { onBack: () => void, config: any }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [time, setTime] = useState(0); 
  
  // Params initialized from config or defaults
  const [params, setParams] = useState({
    uvIntensity: 80, 
    catalystLoading: 1.5,
    phLevel: 7.0,
    temperature: 25,
  });

  const [chartData, setChartData] = useState<{time: number, c_c0: number, intermediate: number}[]>([
    { time: 0, c_c0: 1.0, intermediate: 0 }
  ]);

  const animationRef = useRef<number>(0);

  const resetSimulation = () => {
    setIsRunning(false);
    setProgress(0);
    setTime(0);
    setChartData([{ time: 0, c_c0: 1.0, intermediate: 0 }]);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    if (isRunning) {
      let lastTime = Date.now();
      const loop = () => {
        const now = Date.now();
        const dt = (now - lastTime) / 1000;
        lastTime = now;

        setTime(prev => {
           const newTime = prev + dt * 5; // 5x speed
           const phFactor = 1 - Math.abs(params.phLevel - 7) * 0.1;
           const k = 0.05 * (params.uvIntensity / 100) * (params.catalystLoading) * phFactor; 
           
           setChartData(currentData => {
             const lastEntry = currentData[currentData.length - 1];
             if (newTime - lastEntry.time > 0.5) { 
                const decay = Math.exp(-k * newTime);
                const inter = (1 - decay) * Math.exp(-0.1 * newTime);
                return [...currentData, { time: Number(newTime.toFixed(1)), c_c0: Number(decay.toFixed(3)), intermediate: Number(inter.toFixed(3)) }];
             }
             return currentData;
           });

           if (newTime >= 60) {
             setIsRunning(false);
             return 60;
           }
           setProgress((newTime / 60) * 100);
           return newTime;
        });
        animationRef.current = requestAnimationFrame(loop);
      };
      animationRef.current = requestAnimationFrame(loop);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isRunning, params]);

  const removalRate = ((1 - (chartData[chartData.length - 1]?.c_c0 || 1)) * 100).toFixed(1);

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center shrink-0 border-b border-slate-700 pb-4">
         <div>
           <div className="flex items-center gap-2 mb-1">
              <button onClick={onBack} className="text-slate-400 hover:text-white text-xs underline">返回列表</button>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400 text-xs">Running</span>
           </div>
           <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
             <Cpu className="w-6 h-6 text-blue-400" />
             {config?.name || '未命名仿真任务'} - 执行监控
           </h2>
         </div>
         <div className="flex gap-3">
            <button onClick={resetSimulation} className="p-2 bg-slate-800 border border-slate-700 text-slate-300 rounded hover:bg-slate-700 hover:text-white transition-colors">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleSimulation}
              className={`flex items-center gap-2 px-6 py-2 rounded font-medium text-white transition-all shadow-lg ${
                isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? '暂停计算' : '启动计算'}
            </button>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Controls */}
        <div className="col-span-3 bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col overflow-y-auto">
           <h3 className="text-sm font-bold text-slate-200 uppercase mb-6 flex items-center gap-2">
             <Settings className="w-4 h-4 text-slate-400" /> 边界条件设定
           </h3>
           <div className="space-y-6">
             {/* Sliders... (Simplified for brevity, same logic as before) */}
             {[
               { label: '紫外光强', icon: Zap, key: 'uvIntensity', min: 0, max: 200, unit: 'W/m²' },
               { label: '催化剂', icon: Layers, key: 'catalystLoading', min: 0.1, max: 5, unit: 'g/L' },
               { label: 'pH 环境', icon: Droplets, key: 'phLevel', min: 3, max: 11, unit: '' },
               { label: '系统温度', icon: Thermometer, key: 'temperature', min: 15, max: 60, unit: '°C' }
             ].map(setting => (
                <div key={setting.key} className="space-y-2">
                   <div className="flex justify-between text-xs">
                     <span className="text-slate-400 flex items-center gap-1"><setting.icon className="w-3 h-3"/> {setting.label}</span>
                     <span className="text-blue-400 font-mono">{(params as any)[setting.key]} {setting.unit}</span>
                   </div>
                   <input type="range" min={setting.min} max={setting.max} step={setting.key === 'phLevel' || setting.key === 'catalystLoading' ? 0.1 : 1}
                     value={(params as any)[setting.key]}
                     onChange={(e) => setParams({...params, [setting.key]: Number(e.target.value)})}
                     className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                   />
                </div>
             ))}
           </div>
           <div className="mt-auto pt-4 border-t border-slate-700 text-xs text-slate-500">
              * 实时调整参数将动态触发 ODE 求解器更新
           </div>
        </div>

        {/* Digital Twin & Charts */}
        <div className="col-span-9 flex flex-col gap-6">
           {/* Top: Visualization */}
           <div className="h-64 flex gap-6">
              <div className="w-1/3 bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                 <FlaskConical className={`w-20 h-20 mb-4 ${isRunning ? 'text-blue-400 animate-pulse' : 'text-slate-700'}`} />
                 <div className="text-2xl font-bold text-slate-200">{removalRate}%</div>
                 <div className="text-xs text-slate-500 uppercase">污染物去除率</div>
                 {isRunning && <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300" style={{width: `${progress}%`}}></div>}
              </div>
              <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-4">
                 <h4 className="text-xs font-bold text-slate-400 mb-2">降解动力学实时曲线</h4>
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                       <defs>
                          <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                       <XAxis dataKey="time" stroke="#64748b" tick={{fontSize: 10}} />
                       <YAxis stroke="#64748b" tick={{fontSize: 10}} domain={[0, 1]} />
                       <Tooltip contentStyle={{backgroundColor:'#0f172a', borderColor:'#334155'}} />
                       <Area type="monotone" dataKey="c_c0" stroke="#3b82f6" fill="url(#colorC)" />
                       <Line type="monotone" dataKey="intermediate" stroke="#c084fc" dot={false} strokeWidth={2} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Bottom: Logs */}
           <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-400 overflow-y-auto custom-scrollbar">
              <div className="mb-2 text-slate-500 border-b border-slate-800 pb-1">System Output Log</div>
              {isRunning && (
                 <>
                   <div className="text-green-400"> > Initializing ODE solver... OK</div>
                   <div className="text-blue-400"> > Loading DFT parameters for molecule C-109... Done</div>
                   <div className="text-slate-300"> > Time step: 0.1s | Precision: FP32</div>
                   <div> > t={time.toFixed(1)}m | C/C0={(chartData[chartData.length-1].c_c0).toFixed(4)} | Inter={(chartData[chartData.length-1].intermediate).toFixed(4)}</div>
                 </>
              )}
              {!isRunning && time > 0 && <div className="text-yellow-400"> > Simulation Paused/Finished.</div>}
              {!isRunning && time === 0 && <div className="text-slate-600"> > Ready to start.</div>}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: SIMULATION CREATOR (New Project Wizard) ---

const SimulationCreator = ({ onCancel, onComplete }: { onCancel: () => void, onComplete: (config: any) => void }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    name: '',
    target: '',
    type: 'kinetics',
    nodes: [] as any[]
  });

  const addNode = (nodeTemplate: any) => {
    setConfig(prev => ({
      ...prev,
      nodes: [...prev.nodes, { ...nodeTemplate, instanceId: Date.now() }]
    }));
  };

  const removeNode = (index: number) => {
    setConfig(prev => ({
      ...prev,
      nodes: prev.nodes.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 animate-in slide-in-from-right duration-300 relative">
       {/* Wizard Header */}
       <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800">
          <div>
             <h2 className="text-lg font-bold text-slate-100">新建数字仿真项目</h2>
             <p className="text-xs text-slate-400">Create New Digital Simulation Project</p>
          </div>
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
             <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
             <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
             <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
             <div className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {step === 1 && (
             <div className="max-w-2xl mx-auto space-y-6">
                <h3 className="text-xl font-bold text-slate-200 mb-6">1. 基础信息配置</h3>
                <div>
                   <label className="block text-sm text-slate-400 mb-2">项目名称</label>
                   <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-slate-200 outline-none focus:border-blue-500" placeholder="例如：C-109 光解动力学模拟" value={config.name} onChange={e => setConfig({...config, name: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm text-slate-400 mb-2">目标污染物 (SMILES/Name)</label>
                   <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-slate-200 outline-none focus:border-blue-500" placeholder="C8HF15O4S" value={config.target} onChange={e => setConfig({...config, target: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm text-slate-400 mb-2">仿真类型</label>
                   <div className="grid grid-cols-2 gap-4">
                      {['reaction_kinetics', 'molecular_dynamics', 'toxicity_prediction', 'transport_model'].map(t => (
                         <div key={t} onClick={() => setConfig({...config, type: t})} className={`p-4 rounded border cursor-pointer ${config.type === t ? 'bg-blue-900/30 border-blue-500 text-blue-200' : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'}`}>
                            <div className="capitalize font-medium">{t.replace('_', ' ')}</div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          )}

          {step === 2 && (
             <div className="max-w-5xl mx-auto h-full flex flex-col">
                <div className="mb-6">
                   <h3 className="text-xl font-bold text-slate-200">2. 数字工作流编排 (Low-Code)</h3>
                   <p className="text-sm text-slate-400">无需物理设备，通过拖拽算子构建纯数字仿真流程。</p>
                </div>
                
                <div className="flex-1 flex gap-6 min-h-[400px]">
                   {/* Palette */}
                   <div className="w-64 bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-y-auto">
                      <div className="text-xs font-bold text-slate-500 uppercase mb-4">数字算子库</div>
                      <div className="space-y-3">
                         {DIGITAL_NODES.map(node => (
                            <div key={node.id} onClick={() => addNode(node)} className="p-3 bg-slate-700/50 border border-slate-600 rounded hover:border-blue-500 cursor-pointer group transition-all">
                               <div className="flex items-center gap-2 text-sm font-medium text-slate-200 group-hover:text-blue-400">
                                  {node.type === 'quantum' && <Cpu className="w-4 h-4"/>}
                                  {node.type === 'physics' && <Wind className="w-4 h-4"/>}
                                  {node.type === 'math' && <FileCode className="w-4 h-4"/>}
                                  {node.type === 'ai' && <Bot className="w-4 h-4"/>}
                                  {node.type === 'data' && <Database className="w-4 h-4"/>}
                                  {node.name}
                               </div>
                               <div className="text-[10px] text-slate-500 mt-1">{node.desc}</div>
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* Canvas */}
                   <div className="flex-1 bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg p-8 relative flex items-center overflow-x-auto">
                      {config.nodes.length === 0 && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 pointer-events-none">
                            <Workflow className="w-12 h-12 mb-2 opacity-20" />
                            <p>点击左侧算子添加到工作流</p>
                         </div>
                      )}
                      
                      {config.nodes.map((node, idx) => (
                         <div key={idx} className="flex items-center animate-in zoom-in-50 duration-300">
                            <div className="relative w-40 bg-slate-800 border border-blue-500/50 p-3 rounded-lg shadow-lg">
                               <button onClick={() => removeNode(idx)} className="absolute -top-2 -right-2 bg-red-900 text-red-200 rounded-full p-0.5 hover:bg-red-600"><X className="w-3 h-3"/></button>
                               <div className="text-xs text-blue-400 font-bold mb-1">Step {idx + 1}</div>
                               <div className="text-sm text-slate-200 font-medium truncate">{node.name}</div>
                               <div className="text-[10px] text-slate-500 mt-1">{node.cost}</div>
                            </div>
                            {idx < config.nodes.length - 1 && (
                               <div className="w-8 h-0.5 bg-slate-600 mx-2 relative">
                                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-slate-600 rotate-45"></div>
                               </div>
                            )}
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          )}

          {step === 3 && (
             <div className="max-w-2xl mx-auto text-center space-y-6 pt-10">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                   <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100">配置完成</h3>
                <p className="text-slate-400">项目 "{config.name}" 已准备就绪。包含 {config.nodes.length} 个数字仿真步骤。</p>
                <div className="bg-slate-800 p-4 rounded border border-slate-700 text-left text-sm text-slate-300 max-h-40 overflow-y-auto">
                   <div className="font-bold text-slate-500 mb-2">Workflow Summary:</div>
                   {config.nodes.map((n, i) => (
                      <div key={i} className="flex items-center gap-2">
                         <span className="text-blue-500">{i+1}.</span>
                         {n.name}
                      </div>
                   ))}
                </div>
             </div>
          )}
       </div>

       {/* Wizard Footer */}
       <div className="p-4 border-t border-slate-700 bg-slate-800 flex justify-end gap-3">
          {step === 1 && <button onClick={onCancel} className="px-4 py-2 text-slate-400 hover:text-white">取消</button>}
          {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 text-slate-300 hover:text-white bg-slate-700 rounded">上一步</button>}
          {step < 3 && (
             <button onClick={() => setStep(step + 1)} disabled={!config.name} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                下一步 <ArrowRight className="w-4 h-4" />
             </button>
          )}
          {step === 3 && (
             <button onClick={() => onComplete(config)} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 shadow-lg shadow-green-900/50 font-bold flex items-center gap-2">
                <Play className="w-4 h-4" /> 启动仿真
             </button>
          )}
       </div>
    </div>
  )
}

// --- MAIN COMPONENT: SIMULATION MANAGER ---

const Simulation: React.FC = () => {
  const [view, setView] = useState<'list' | 'create' | 'run'>('list');
  const [activeConfig, setActiveConfig] = useState<any>(null);

  const handleStartCreate = () => setView('create');
  const handleCancelCreate = () => setView('list');
  const handleCompleteCreate = (config: any) => {
     setActiveConfig(config);
     setView('run');
  };
  const handleRunExisting = (sim: any) => {
     setActiveConfig(sim);
     setView('run');
  };

  if (view === 'create') {
     return <SimulationCreator onCancel={handleCancelCreate} onComplete={handleCompleteCreate} />;
  }

  if (view === 'run') {
     return <SimulationRunner onBack={() => setView('list')} config={activeConfig} />;
  }

  // Default: List View
  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
         <div>
           <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
             <FlaskConical className="w-6 h-6 text-blue-400" />
             数字仿真实验 (Digital Simulation)
           </h2>
           <p className="text-sm text-slate-400 mt-1">无需物理实验，利用数字孪生与 AI 模型进行低成本、高通量推演。</p>
         </div>
         <button 
           onClick={handleStartCreate}
           className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium shadow-lg shadow-blue-900/50 flex items-center gap-2"
         >
            <Plus className="w-4 h-4" /> 新建仿真项目
         </button>
      </div>

      <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
         {/* Stats Row */}
         <div className="grid grid-cols-4 gap-0 divide-x divide-slate-700 bg-slate-800/50 border-b border-slate-700">
            <div className="p-4">
               <div className="text-slate-500 text-xs uppercase mb-1">累计仿真时长</div>
               <div className="text-xl font-bold text-slate-200">1,240 <span className="text-xs font-normal text-slate-500">hrs</span></div>
            </div>
            <div className="p-4">
               <div className="text-slate-500 text-xs uppercase mb-1">节省试剂成本</div>
               <div className="text-xl font-bold text-green-400">¥ 45.2w</div>
            </div>
            <div className="p-4">
               <div className="text-slate-500 text-xs uppercase mb-1">算力负载</div>
               <div className="text-xl font-bold text-blue-400">42 <span className="text-xs font-normal text-slate-500">%</span></div>
            </div>
            <div className="p-4">
               <div className="text-slate-500 text-xs uppercase mb-1">活跃任务</div>
               <div className="text-xl font-bold text-purple-400">3</div>
            </div>
         </div>

         <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left text-sm">
               <thead className="bg-slate-900 text-slate-400 text-xs uppercase sticky top-0 z-10">
                  <tr>
                     <th className="p-4 font-medium">项目 ID / 名称</th>
                     <th className="p-4 font-medium">仿真类型</th>
                     <th className="p-4 font-medium">创建日期</th>
                     <th className="p-4 font-medium">负责人</th>
                     <th className="p-4 font-medium">状态</th>
                     <th className="p-4 font-medium text-right">操作</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-700/50">
                  {RECENT_SIMULATIONS.map(sim => (
                     <tr key={sim.id} className="hover:bg-slate-700/30 transition-colors group cursor-pointer" onClick={() => handleRunExisting(sim)}>
                        <td className="p-4">
                           <div className="font-medium text-slate-200 group-hover:text-blue-400">{sim.name}</div>
                           <div className="text-xs text-slate-500 mt-0.5">{sim.id}</div>
                        </td>
                        <td className="p-4">
                           <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-700 text-slate-300 text-xs">
                              <Box className="w-3 h-3" /> {sim.type}
                           </span>
                        </td>
                        <td className="p-4 text-slate-400 font-mono text-xs">{sim.date}</td>
                        <td className="p-4 text-slate-300">{sim.owner}</td>
                        <td className="p-4">
                           <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs capitalize ${
                              sim.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              sim.status === 'running' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              'bg-slate-500/10 text-slate-400 border border-slate-600'
                           }`}>
                              {sim.status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>}
                              {sim.status}
                           </span>
                        </td>
                        <td className="p-4 text-right">
                           <button className="p-2 hover:bg-slate-600 rounded text-slate-400 hover:text-white">
                              <ChevronRight className="w-4 h-4" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default Simulation;