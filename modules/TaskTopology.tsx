import React, { useState } from 'react';
import { WorkflowNode, WorkflowEdge } from '../../types';
import { ArrowLeft, Database, FileText, Activity, Clock, FlaskConical, Cpu, Settings, ShieldAlert, GitMerge, CheckCircle, Share2 } from 'lucide-react';

// Complex Mock Data for a realistic scientific workflow
const nodes: WorkflowNode[] = [
  // Phase 1: 物理实验与采集
  { 
    id: 'n1', label: '样品自动化采集', type: 'process', status: 'completed', x: 80, y: 300,
    config: { name: '样品自动化采集', device: 'Auto-Sampler' },
    details: { startTime: '2024-05-20 08:30', inputs: [{label:'点位', value:'S-04'}], outputs: [{label:'样品ID', value:'SMP-01'}], logs: ['采样完成'] }
  },
  { 
    id: 'n2', label: '冷链运输与接收', type: 'process', status: 'completed', x: 200, y: 300,
    config: { name: '冷链运输与接收' },
    details: { startTime: '2024-05-20 09:00', inputs: [{label:'温度', value:'4°C'}], outputs: [], logs: ['入库扫描完成'] }
  },
  // Branch A: 固相萃取
  { 
    id: 'n3', label: '固相萃取 (SPE)', type: 'process', status: 'completed', x: 350, y: 200,
    config: { name: '固相萃取 (SPE)', device: 'Auto-SPE' },
    details: { startTime: '2024-05-20 09:30', inputs: [{label:'柱类型', value:'HLB'}], outputs: [{label:'浓缩液', value:'1mL'}], logs: ['萃取完成'] }
  },
  // Branch B: 液液萃取 (Contrast)
  { 
    id: 'n3b', label: '液液萃取 (LLE)', type: 'process', status: 'completed', x: 350, y: 400,
    config: { name: '液液萃取 (LLE)' },
    details: { startTime: '2024-05-20 09:35', inputs: [{label:'溶剂', value:'二氯甲烷'}], outputs: [], logs: ['分层完成'] }
  },
  { 
    id: 'n4', label: '样品合并与复溶', type: 'process', status: 'completed', x: 500, y: 300,
    config: { name: '样品合并与复溶' },
    details: { startTime: '2024-05-20 10:30', inputs: [], outputs: [{label:'进样瓶', value:'Vial-99'}], logs: ['氮吹复溶完成'] }
  },
  // Phase 2: 仪器分析
  { 
    id: 'n5', label: 'Q-TOF MS 数据采集', type: 'process', status: 'completed', x: 650, y: 300,
    config: { name: 'Q-TOF MS 数据采集', device: 'Q-TOF MS' },
    details: { startTime: '2024-05-20 10:50', inputs: [{label:'模式', value:'SWATH'}], outputs: [{label:'Raw Data', value:'4.2GB'}], logs: ['采集结束'] }
  },
  // Phase 3: 数字孪生与AI推演 (High Complexity Area)
  { 
    id: 'n6', label: '特征峰提取 (NTS)', type: 'ai_analysis', status: 'completed', x: 800, y: 300,
    config: { name: '特征峰提取 (NTS)', algorithm: 'NTS-PeakPick-V3' },
    details: { startTime: '2024-05-20 12:00', inputs: [{label:'SNR', value:'>10'}], outputs: [{label:'特征数', value:'12k+'}], logs: ['峰对齐完成'] }
  },
  // AI Branch 1: Structure
  { 
    id: 'n7', label: '数据库匹配 (Suspect)', type: 'ai_analysis', status: 'completed', x: 950, y: 150,
    config: { name: '数据库匹配 (Suspect)', dataSource: 'MzCloud' },
    details: { startTime: '2024-05-20 12:20', inputs: [{label:'库', value:'MzCloud'}], outputs: [{label:'Hits', value:'45'}], logs: ['匹配率 98%'] }
  },
  { 
    id: 'n8', label: '结构解析智能体', type: 'ai_analysis', status: 'running', x: 950, y: 250,
    config: { name: '结构解析智能体', modelBase: 'RenDu' },
    details: { startTime: '2024-05-20 12:30', inputs: [{label:'Agent', value:'RenDu'}], outputs: [], logs: ['正在计算碎片树...'], metrics: [{label:'Confidence', value:'87%', status:'normal'}] }
  },
  // AI Branch 2: Toxicity
  { 
    id: 'n9', label: 'QSAR 毒性预测', type: 'ai_analysis', status: 'running', x: 950, y: 350,
    config: { name: 'QSAR 毒性预测', algorithm: 'ToxCast-Prediction-Light' },
    details: { startTime: '2024-05-20 12:35', inputs: [], outputs: [], logs: ['加载模型权重...'], metrics: [{label:'LC50', value:'Predicting', status:'warning'}] }
  },
  { 
    id: 'n10', label: '分子对接模拟', type: 'ai_analysis', status: 'pending', x: 950, y: 450,
    config: { name: '分子对接模拟' },
    details: { startTime: '-', inputs: [], outputs: [], logs: [] }
  },
  // Phase 4: Decision & Governance
  { 
    id: 'n11', label: '多模态证据融合', type: 'ai_analysis', status: 'pending', x: 1150, y: 300, config: { name: '多模态证据融合' } },
  { 
    id: 'n12', label: '专家人工复核', type: 'decision', status: 'pending', x: 1300, y: 300, config: { name: '专家人工复核' } },
  { 
    id: 'n13', label: '环境风险综合评估', type: 'decision', status: 'pending', x: 1450, y: 300, config: { name: '环境风险综合评估' } },
  { 
    id: 'n14', label: '治理技术仿真验证', type: 'process', status: 'pending', x: 1600, y: 300, config: { name: '治理技术仿真验证' } },
];

const edges: WorkflowEdge[] = [
  { id: 'e1', from: 'n1', to: 'n2' },
  { id: 'e2', from: 'n2', to: 'n3' },
  { id: 'e3', from: 'n2', to: 'n3b' },
  { id: 'e4', from: 'n3', to: 'n4' },
  { id: 'e5', from: 'n3b', to: 'n4' },
  { id: 'e6', from: 'n4', to: 'n5' },
  { id: 'e7', from: 'n5', to: 'n6' },
  { id: 'e8', from: 'n6', to: 'n7' },
  { id: 'e9', from: 'n6', to: 'n8' },
  { id: 'e10', from: 'n6', to: 'n9' },
  { id: 'e11', from: 'n6', to: 'n10' },
  { id: 'e12', from: 'n7', to: 'n11' },
  { id: 'e13', from: 'n8', to: 'n11' },
  { id: 'e14', from: 'n9', to: 'n11' },
  { id: 'e15', from: 'n10', to: 'n11' },
  { id: 'e16', from: 'n11', to: 'n12' },
  { id: 'e17', from: 'n12', to: 'n13' },
  { id: 'e18', from: 'n13', to: 'n14' },
];

interface TaskTopologyProps {
  onBack: () => void;
}

const TaskTopology: React.FC<TaskTopologyProps> = ({ onBack }) => {
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(nodes.find(n => n.status === 'running') || nodes[0]);

  const getNodeColor = (status: string) => {
    switch(status) {
      case 'completed': return '#10b981'; // green-500
      case 'running': return '#3b82f6'; // blue-500
      case 'error': return '#ef4444'; // red-500
      default: return '#475569'; // slate-600
    }
  };

  const getNodeIcon = (type: string) => {
    switch(type) {
      case 'process': return <FlaskConical className="w-4 h-4 text-white" />;
      case 'ai_analysis': return <Cpu className="w-4 h-4 text-white" />;
      case 'decision': return <ShieldAlert className="w-4 h-4 text-white" />;
      default: return <Activity className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Header */}
      <div className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-900 shrink-0 justify-between z-20 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-slate-100 font-bold text-lg flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-500" />
              Task-2024-X09 全流程全景视图
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">Running</span>
            </h2>
            <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
               <span>Owner: Dr. Li</span>
               <span className="text-slate-700">|</span>
               <span>Duration: 4h 32m</span>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-6 text-xs text-slate-400 bg-slate-950/50 px-4 py-2 rounded-full border border-slate-800">
           <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div> 已完成
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div> 执行中
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-500"></div> 待执行
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Topology Canvas */}
        <div className="flex-1 relative overflow-auto bg-[#0f172a] cursor-grab active:cursor-grabbing">
           {/* Grid Background */}
           <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
                style={{ 
                  backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', 
                  backgroundSize: '30px 30px' 
                }}>
           </div>
           
           <svg className="w-[1800px] h-full min-h-[800px] relative z-10 mx-10 my-10">
              <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="22" refY="2" orient="auto">
                  <polygon points="0 0, 6 2, 0 4" fill="#64748b" />
                </marker>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Edges with Bezier Curves */}
              {edges.map((edge, idx) => {
                const source = nodes.find(n => n.id === edge.from)!;
                const target = nodes.find(n => n.id === edge.to)!;
                // Control points for bezier curve to make it look smooth
                const midX = (source.x + target.x) / 2;
                return (
                  <path 
                    key={idx}
                    d={`M ${source.x} ${source.y} C ${midX} ${source.y}, ${midX} ${target.y}, ${target.x} ${target.y}`}
                    fill="none"
                    stroke={target.status === 'running' ? '#3b82f6' : '#334155'}
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                    strokeDasharray={target.status === 'pending' ? '5,5' : '0'}
                    className="transition-colors duration-500"
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => (
                <g 
                  key={node.id} 
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer transition-all duration-300 group"
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                >
                  {/* Pulse Effect for Running Node */}
                  {node.status === 'running' && (
                    <>
                      <circle cx={node.x} cy={node.y} r="40" fill={getNodeColor(node.status)} opacity="0.1">
                        <animate attributeName="r" from="25" to="50" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.2" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={node.x} cy={node.y} r="32" fill="none" stroke={getNodeColor(node.status)} strokeWidth="1" strokeDasharray="4 2">
                         <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="10s" repeatCount="indefinite" />
                      </circle>
                    </>
                  )}
                  
                  {/* Node Background */}
                  <circle 
                    cx={node.x} cy={node.y} r="22" 
                    fill="#1e293b" 
                    stroke={getNodeColor(node.status)} 
                    strokeWidth={selectedNode?.id === node.id ? 3 : 2}
                    className={`transition-all duration-300 ${selectedNode?.id === node.id ? 'filter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]' : ''}`}
                  />
                  
                  {/* Icon Container using ForeignObject for Lucide Icons */}
                  <foreignObject x={node.x - 10} y={node.y - 10} width="20" height="20" className="pointer-events-none">
                    <div className="flex items-center justify-center w-full h-full">
                       {getNodeIcon(node.type)}
                    </div>
                  </foreignObject>

                  {/* Label */}
                  <foreignObject x={node.x - 60} y={node.y + 30} width="120" height="40" className="pointer-events-none overflow-visible">
                     <div className={`text-center text-[11px] font-medium leading-tight transition-colors ${selectedNode?.id === node.id ? 'text-blue-300 scale-110' : 'text-slate-400'}`}>
                        {node.label}
                     </div>
                  </foreignObject>
                </g>
              ))}
           </svg>
        </div>

        {/* Detail Panel */}
        <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl z-20 transition-all duration-300">
          {selectedNode ? (
            <>
              {/* Node Header */}
              <div className="p-6 border-b border-slate-800 bg-slate-800/30">
                <div className="flex items-center justify-between mb-3">
                   <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                     ID: {selectedNode.id}
                   </span>
                   <div className={`px-2 py-0.5 rounded text-xs uppercase font-bold flex items-center gap-1.5 ${
                      selectedNode.status === 'running' ? 'text-blue-400 bg-blue-500/10' :
                      selectedNode.status === 'completed' ? 'text-green-400 bg-green-500/10' :
                      'text-slate-400 bg-slate-700/20'
                   }`}>
                     <div className={`w-1.5 h-1.5 rounded-full ${
                        selectedNode.status === 'running' ? 'bg-blue-400 animate-pulse' :
                        selectedNode.status === 'completed' ? 'bg-green-400' : 'bg-slate-400'
                     }`}></div>
                     {selectedNode.status}
                   </div>
                </div>
                <h3 className="text-lg font-bold text-slate-100 leading-tight">{selectedNode.label}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                  {selectedNode.type === 'process' && <FlaskConical className="w-3 h-3" />}
                  {selectedNode.type === 'ai_analysis' && <Cpu className="w-3 h-3" />}
                  {selectedNode.type === 'decision' && <ShieldAlert className="w-3 h-3" />}
                  <span>
                    {selectedNode.type === 'process' && '物理实验步骤'}
                    {selectedNode.type === 'ai_analysis' && 'AI 智能体推演'}
                    {selectedNode.type === 'decision' && '决策与评估'}
                  </span>
                </div>
              </div>

              {/* Node Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {selectedNode.details ? (
                  <>
                    {/* Timeline */}
                    <div className="flex gap-4">
                       <div className="flex-1 bg-slate-800/50 p-3 rounded border border-slate-700/50">
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Start Time</div>
                          <div className="text-sm font-mono text-slate-200 flex items-center gap-2">
                             <Clock className="w-3 h-3 text-slate-500" />
                             {selectedNode.details.startTime}
                          </div>
                       </div>
                       <div className="flex-1 bg-slate-800/50 p-3 rounded border border-slate-700/50">
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">End Time</div>
                          <div className="text-sm font-mono text-slate-200">
                             {selectedNode.details.endTime || '--:--'}
                          </div>
                       </div>
                    </div>

                    {/* I/O Data */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                         <Database className="w-3.5 h-3.5" /> 输入与输出
                      </h4>
                      <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-3">
                        <div className="space-y-1">
                          <div className="text-[10px] text-slate-500 mb-1">INPUTS</div>
                          {selectedNode.details.inputs.map((item, i) => (
                             <div key={i} className="flex justify-between text-sm bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                <span className="text-slate-400">{item.label}</span>
                                <span className="text-slate-200 font-medium">{item.value}</span>
                             </div>
                          ))}
                        </div>
                        <div className="flex justify-center text-slate-700"><Activity className="w-3 h-3 rotate-90" /></div>
                        <div className="space-y-1">
                          <div className="text-[10px] text-blue-500/70 mb-1">OUTPUTS</div>
                          {selectedNode.details.outputs.map((item, i) => (
                             <div key={i} className="flex justify-between text-sm bg-blue-900/10 px-2 py-1 rounded border border-blue-500/20">
                                <span className="text-blue-300">{item.label}</span>
                                <span className="text-blue-100 font-medium">{item.value}</span>
                             </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Metrics Dashboard */}
                    {selectedNode.details.metrics && (
                      <div>
                         <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                           <Activity className="w-3.5 h-3.5" /> 关键质控指标 (QC)
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                           {selectedNode.details.metrics.map((m, i) => (
                             <div key={i} className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center ${
                               m.status === 'warning' ? 'bg-orange-500/10 border-orange-500/30 text-orange-200' : 'bg-slate-800 border-slate-700 text-slate-300'
                             }`}>
                                <div className="text-xl font-bold mb-1">{m.value}</div>
                                <div className="text-[10px] opacity-70 uppercase tracking-wide">{m.label}</div>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}

                    {/* Logs */}
                    <div>
                       <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                         <FileText className="w-3.5 h-3.5" /> 运行日志
                      </h4>
                      <div className="bg-black/40 rounded-lg p-3 font-mono text-[11px] text-slate-400 space-y-1.5 max-h-48 overflow-y-auto border border-slate-800 custom-scrollbar">
                         {selectedNode.details.logs.map((log, i) => (
                            <div key={i} className="flex gap-2">
                               <span className="text-slate-600">[{selectedNode.details?.startTime.split(' ')[1]}]</span>
                               <span className="text-slate-300">{log}</span>
                            </div>
                         ))}
                         {selectedNode.status === 'running' && (
                            <div className="flex gap-2 animate-pulse text-blue-400">
                               <span>&gt;</span>
                               <span>Processing...</span>
                            </div>
                         )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                     <Clock className="w-12 h-12 mb-3 stroke-1" />
                     <p className="text-sm font-medium">环节待启动</p>
                     <p className="text-xs mt-1">等待前序任务完成...</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 p-6 text-center">
              <p>点击流程节点<br/>查看详细数据与日志</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskTopology;