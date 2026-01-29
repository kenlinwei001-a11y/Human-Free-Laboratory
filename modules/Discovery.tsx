import React, { useState } from 'react';
import { PollutantCandidate } from '../types';
import { Filter, Search, ArrowUpRight, Microscope, ChevronDown, Download, X, Activity, Database, FileDigit } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from 'recharts';

// Mock Data Generation
const generateMockData = (): PollutantCandidate[] => {
  const baseData = [
    { id: 'C-102', signalId: 'mz_455.12', intensity: 8500, frequency: 12, noveltyScore: 92, riskScore: 78, location: '入海口-A', status: '待分析' },
    { id: 'C-105', signalId: 'mz_321.08', intensity: 12400, frequency: 45, noveltyScore: 45, riskScore: 32, location: '水厂进水', status: '已确认' },
    { id: 'C-109', signalId: 'mz_566.21', intensity: 6200, frequency: 8, noveltyScore: 88, riskScore: 85, location: '工业区下游', status: '分析中' },
    { id: 'C-112', signalId: 'mz_288.15', intensity: 3100, frequency: 2, noveltyScore: 95, riskScore: 60, location: '背景点', status: '待分析' },
  ];
  // Generate 20 more
  const locations = ['长江口 S-04', '太湖中心区', '污水厂排口', '工业园区 A2', '农田灌溉渠', '饮用水源地 B'];
  const statuses = ['待分析', '分析中', '已确认', '待分析', '已确认'];
  const generated = Array.from({ length: 20 }).map((_, i) => ({
    id: `C-${200 + i}`,
    signalId: `mz_${(Math.random() * 800 + 100).toFixed(2)}`,
    intensity: Math.floor(Math.random() * 15000 + 1000),
    frequency: Math.floor(Math.random() * 50 + 1),
    noveltyScore: Math.floor(Math.random() * 60 + 40),
    riskScore: Math.floor(Math.random() * 100),
    location: locations[i % locations.length],
    status: statuses[i % statuses.length] as any
  }));
  return [...baseData, ...generated];
};

const mockCandidates: PollutantCandidate[] = generateMockData();

// Mock Spectrum Data for detail view
const generateSpectrum = (id: string) => {
  const points = [];
  for (let i = 100; i < 800; i+=2) {
    let val = Math.random() * 50;
    // Inject peaks based on ID hash
    if (i % 50 === 0) val = Math.random() * 800 + 200;
    points.push({ mz: i, intensity: val });
  }
  return points;
};

const Discovery: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<PollutantCandidate | null>(null);

  const spectrumData = selectedCandidate ? generateSpectrum(selectedCandidate.id) : [];

  return (
    <div className="p-6 h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
           <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
             新污染物发现与筛选
             <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded border border-slate-700">{mockCandidates.length} Items</span>
           </h2>
           <p className="text-sm text-slate-400 mt-1">基于非靶向筛查(NTS)数据，识别高风险候选物</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="搜索 m/z 信号或ID..." 
              className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-md pl-9 pr-4 py-2 focus:ring-1 focus:ring-blue-500 outline-none w-64"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-md border border-slate-700 text-sm transition-colors">
            <Filter className="w-4 h-4" />
            高级筛选
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm transition-colors shadow-lg shadow-blue-900/50">
            <Download className="w-4 h-4" />
            导出列表
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden gap-6">
         {/* Main Table */}
         <div className={`flex-1 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex flex-col shadow-xl transition-all duration-300 ${selectedCandidate ? 'w-2/3' : 'w-full'}`}>
           <div className="overflow-auto custom-scrollbar flex-1">
             <table className="w-full text-left border-collapse">
               <thead className="sticky top-0 bg-slate-900 z-10 shadow-sm">
                 <tr className="text-slate-400 text-xs uppercase border-b border-slate-700">
                   <th className="p-4 font-medium w-32">候选物ID</th>
                   <th className="p-4 font-medium w-40">质荷比 (m/z)</th>
                   <th className="p-4 font-medium w-48">丰度 (Intensity)</th>
                   <th className="p-4 font-medium w-32 cursor-pointer hover:text-slate-200 flex items-center gap-1">
                     新颖性评分 <ChevronDown className="w-3 h-3" />
                   </th>
                   <th className="p-4 font-medium w-32 cursor-pointer hover:text-slate-200">
                     风险初筛分
                   </th>
                   <th className="p-4 font-medium">检出点位</th>
                   <th className="p-4 font-medium w-32">状态</th>
                   <th className="p-4 font-medium text-right w-32">操作</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-700/50 text-sm">
                 {mockCandidates.map((item, idx) => (
                   <tr 
                     key={item.id} 
                     onClick={() => setSelectedCandidate(item)}
                     className={`cursor-pointer transition-colors group ${
                       selectedCandidate?.id === item.id 
                         ? 'bg-blue-900/20 border-l-2 border-blue-500' 
                         : idx % 2 === 0 ? 'bg-slate-800/50 hover:bg-slate-700/40' : 'bg-transparent hover:bg-slate-700/40'
                     }`}
                   >
                     <td className={`p-4 font-mono font-bold ${selectedCandidate?.id === item.id ? 'text-blue-300' : 'text-slate-200'}`}>{item.id}</td>
                     <td className="p-4 text-blue-400 font-mono tracking-wide">{item.signalId}</td>
                     <td className="p-4 text-slate-300">
                       <div className="flex items-center gap-3">
                          <span className="text-xs w-12 text-right font-mono opacity-70">{item.intensity}</span>
                          <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${item.intensity > 10000 ? 'bg-purple-500' : 'bg-blue-500'}`} 
                              style={{ width: `${Math.min((item.intensity / 15000) * 100, 100)}%` }}
                            ></div>
                          </div>
                       </div>
                     </td>
                     <td className="p-4">
                       <span className={`px-2 py-0.5 rounded text-xs border font-medium ${
                         item.noveltyScore > 90 ? 'text-purple-300 border-purple-500/30 bg-purple-500/20' : 
                         item.noveltyScore > 60 ? 'text-blue-300 border-blue-500/30 bg-blue-500/10' :
                         'text-slate-400 border-slate-600 bg-slate-700/20'
                       }`}>
                         {item.noveltyScore}
                       </span>
                     </td>
                     <td className="p-4">
                       <div className="flex items-center gap-2">
                         <span className={`font-bold ${
                           item.riskScore > 80 ? 'text-red-400' : item.riskScore > 50 ? 'text-yellow-400' : 'text-green-400'
                         }`}>
                           {item.riskScore}
                         </span>
                         {item.riskScore > 80 && <ArrowUpRight className="w-3 h-3 text-red-500" />}
                       </div>
                     </td>
                     <td className="p-4 text-slate-400 text-xs">{item.location}</td>
                     <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                           item.status === '分析中' ? 'bg-blue-900/30 text-blue-300 border-blue-700/50' :
                           item.status === '已确认' ? 'bg-green-900/30 text-green-300 border-green-700/50' :
                           'bg-slate-700/50 text-slate-400 border-slate-600'
                        }`}>
                           {item.status === '分析中' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>}
                           {item.status}
                        </span>
                     </td>
                     <td className="p-4 text-right">
                       <button className="text-slate-300 hover:text-white flex items-center justify-center gap-1 ml-auto text-xs border border-slate-600 hover:border-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded transition-all shadow-sm">
                         <Microscope className="w-3.5 h-3.5" />
                         分析
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
           
           <div className="h-10 border-t border-slate-700 bg-slate-800 flex items-center justify-between px-4 text-xs text-slate-400 shrink-0">
              <div>Showing 1-24 of 1,240 results</div>
              <div className="flex gap-2">
                 <button className="hover:text-white disabled:opacity-50" disabled>Previous</button>
                 <div className="flex gap-1">
                    <button className="w-6 h-6 bg-blue-600 text-white rounded">1</button>
                    <button className="w-6 h-6 hover:bg-slate-700 rounded">2</button>
                    <span className="w-6 h-6 text-center leading-6">...</span>
                 </div>
                 <button className="hover:text-white">Next</button>
              </div>
           </div>
         </div>

         {/* Side Detail Panel */}
         {selectedCandidate && (
            <div className="w-1/3 bg-slate-900 border-l border-slate-700 flex flex-col animate-in slide-in-from-right duration-300 absolute right-0 top-0 bottom-0 shadow-2xl z-20">
               <div className="h-12 border-b border-slate-700 flex items-center justify-between px-4 bg-slate-800">
                  <h3 className="font-bold text-slate-100 flex items-center gap-2">
                     <FileDigit className="w-4 h-4 text-blue-400" />
                     信号详情: {selectedCandidate.id}
                  </h3>
                  <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-white">
                     <X className="w-4 h-4" />
                  </button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Spectrum Chart */}
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                           <Activity className="w-3 h-3" /> MS/MS 质谱图
                        </span>
                        <span className="text-xs text-blue-400 font-mono">{selectedCandidate.signalId}</span>
                     </div>
                     <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={spectrumData}>
                              <defs>
                                 <linearGradient id="specGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                              <XAxis dataKey="mz" tick={{fontSize: 10}} stroke="#64748b" />
                              <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px'}} />
                              <Area type="monotone" dataKey="intensity" stroke="#3b82f6" fill="url(#specGrad)" isAnimationActive={false} />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* Attributes */}
                  <div className="grid grid-cols-2 gap-3">
                     <div className="bg-slate-800 p-3 rounded border border-slate-700">
                        <div className="text-[10px] text-slate-500 uppercase mb-1">保留时间 (RT)</div>
                        <div className="text-sm font-mono text-slate-200">12.45 min</div>
                     </div>
                     <div className="bg-slate-800 p-3 rounded border border-slate-700">
                        <div className="text-[10px] text-slate-500 uppercase mb-1">质量偏差</div>
                        <div className="text-sm font-mono text-green-400">1.2 ppm</div>
                     </div>
                  </div>

                  {/* Database Hits */}
                  <div>
                     <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-2">
                        <Database className="w-3 h-3" /> 数据库匹配结果 (Top 3)
                     </div>
                     <div className="space-y-2">
                        {[
                           { name: 'Perfluorooctane sulfonate (PFOS)', score: 85, db: 'MzCloud' },
                           { name: 'PFHxS Isomer A', score: 62, db: 'EPA-Tox' },
                           { name: 'Unknown Fluorinated C8', score: 45, db: 'In-House' }
                        ].map((hit, i) => (
                           <div key={i} className="flex justify-between items-center bg-slate-800 p-2 rounded border border-slate-700 text-xs">
                              <span className="text-slate-300 truncate w-32">{hit.name}</span>
                              <div className="flex items-center gap-2">
                                 <span className="text-slate-500 text-[10px]">{hit.db}</span>
                                 <span className={`font-bold ${hit.score > 80 ? 'text-green-400' : 'text-yellow-400'}`}>{hit.score}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* AI Prediction */}
                  <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded">
                     <div className="text-xs font-bold text-blue-400 mb-1">AI 结构推断</div>
                     <p className="text-xs text-blue-200/80 leading-relaxed">
                        基于特征碎片 m/z 145, 223，该信号极有可能属于 <span className="text-white font-medium">全氟醚磺酸类 (PFESA)</span> 同系物。建议进入结构解析流程。
                     </p>
                     <button className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white text-xs py-1.5 rounded transition-colors">
                        发送至结构解析智能体
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default Discovery;