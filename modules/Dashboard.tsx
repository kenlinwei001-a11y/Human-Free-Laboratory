import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { Target, AlertTriangle, ScanLine, Database, Clock, PlayCircle, PauseCircle, CheckCircle2, AlertOctagon, MoreHorizontal, Layers, ArrowRight } from 'lucide-react';
import { ResearchTask } from '../types';

interface DashboardProps {
  onTaskClick?: (taskId: string) => void;
}

const dataTrend = [
  { time: '08:00', value: 12 },
  { time: '09:00', value: 18 },
  { time: '10:00', value: 35 },
  { time: '11:00', value: 28 },
  { time: '12:00', value: 45 },
  { time: '13:00', value: 52 },
  { time: '14:00', value: 48 },
];

const riskDist = [
  { name: '低风险', count: 120, color: '#3b82f6' },
  { name: '中风险', count: 45, color: '#eab308' },
  { name: '高风险', count: 12, color: '#f97316' },
  { name: '极高', count: 3, color: '#ef4444' },
];

const activeTasks: ResearchTask[] = [
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
  },
  {
    id: 'Task-2024-A01',
    name: '抗癫痫药物环境归趋模拟',
    priority: 'Low',
    stage: 'sample_prep',
    stageLabel: '任务排队中',
    progress: 0,
    status: 'queued',
    startTime: '-',
    estimatedEndTime: '-',
    owner: 'System'
  }
];

const StatCard = ({ title, value, unit, icon: Icon, colorClass }: any) => (
  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-start justify-between">
    <div>
      <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">{title}</div>
      <div className="text-2xl font-bold text-slate-100 flex items-baseline gap-1">
        {value}
        <span className="text-sm font-normal text-slate-500">{unit}</span>
      </div>
    </div>
    <div className={`p-2 rounded-lg ${colorClass} bg-opacity-20`}>
      <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
    </div>
  </div>
);

const TaskStatusBadge = ({ status }: { status: ResearchTask['status'] }) => {
  switch (status) {
    case 'running':
      return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>运行中</span>;
    case 'paused':
      return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"><PauseCircle className="w-3 h-3" />暂停</span>;
    case 'completed':
      return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20"><CheckCircle2 className="w-3 h-3" />已完成</span>;
    case 'error':
      return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20"><AlertOctagon className="w-3 h-3" />异常</span>;
    case 'queued':
      return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-400 border border-slate-600"><Clock className="w-3 h-3" />排队中</span>;
    default:
      return null;
  }
};

const Dashboard: React.FC<DashboardProps> = ({ onTaskClick }) => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="已采集数据批次" value="1,240" unit="批" icon={Database} colorClass="bg-blue-500" />
        <StatCard title="发现候选物" value="38" unit="个" icon={ScanLine} colorClass="bg-purple-500" />
        <StatCard title="正在推演" value="5" unit="任务" icon={Target} colorClass="bg-indigo-500" />
        <StatCard title="高风险预警" value="3" unit="项" icon={AlertTriangle} colorClass="bg-red-500" />
      </div>

      {/* Global Task Monitor Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
           <h3 className="text-slate-100 font-semibold flex items-center gap-2">
             <Layers className="w-4 h-4 text-blue-400" />
             全局任务执行监控 (Global Task Monitor)
           </h3>
           <button className="text-xs text-blue-400 hover:text-blue-300">查看所有任务</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/30 text-slate-400 text-xs uppercase border-b border-slate-700/50">
                <th className="p-4 font-medium">任务名称 / ID</th>
                <th className="p-4 font-medium">当前环节</th>
                <th className="p-4 font-medium w-64">执行进度</th>
                <th className="p-4 font-medium">状态</th>
                <th className="p-4 font-medium">预计完成时间</th>
                <th className="p-4 font-medium">负责人</th>
                <th className="p-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-sm">
              {activeTasks.map((task) => (
                <tr 
                  key={task.id} 
                  className="hover:bg-slate-700/20 transition-colors cursor-pointer group"
                  onClick={() => onTaskClick && onTaskClick(task.id)}
                >
                  <td className="p-4">
                    <div className="font-medium text-slate-200 group-hover:text-blue-400 transition-colors">{task.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{task.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-300">{task.stageLabel}</div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      {task.priority === 'High' && <span className="text-orange-400">High Priority</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${task.status === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-400 w-8 text-right">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <TaskStatusBadge status={task.status} />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-300">
                       <Clock className="w-3.5 h-3.5 text-slate-500" />
                       {task.estimatedEndTime}
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">{task.owner}</td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-5">
          <h3 className="text-slate-100 font-semibold mb-4 text-sm">非靶向筛查信号检出趋势</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataTrend}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 12}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                  itemStyle={{ color: '#93c5fd' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <h3 className="text-slate-100 font-semibold mb-4 text-sm">风险等级分布</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDist} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#94a3b8" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={60} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                  {riskDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity / Timeline */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
         <h3 className="text-slate-100 font-semibold mb-4 text-sm">最新实验动态</h3>
         <div className="space-y-4 relative">
            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-700"></div>
            
            {[
              { time: '14:32', event: '系统自动识别出候选物 C-109 的同分异构体结构', type: 'success' },
              { time: '14:15', event: 'Q-TOF MS 批次 B-99 数据采集完成，正在清洗数据', type: 'info' },
              { time: '13:50', event: '警告：反应釜-03 温度波动异常，已暂停实验流程', type: 'warning' },
              { time: '13:00', event: '启动针对全氟替代物的新一轮光降解模拟', type: 'info' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 relative z-10">
                <div className={`w-4 h-4 rounded-full mt-1 border-2 ${
                  item.type === 'warning' ? 'bg-orange-900 border-orange-500' : 
                  item.type === 'success' ? 'bg-green-900 border-green-500' : 
                  'bg-blue-900 border-blue-500'
                }`}></div>
                <div>
                  <div className="text-xs text-slate-500 font-mono">{item.time}</div>
                  <div className="text-sm text-slate-300">{item.event}</div>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;