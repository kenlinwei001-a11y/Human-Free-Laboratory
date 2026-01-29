import React, { useState } from 'react';
import { ArrowRight, Box, Share2, ZoomIn, CheckCircle2, ShieldAlert, Scale, FileCheck, AlertTriangle, Download } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const isomerData = [
   { 
      name: '结构异构体 A', 
      match: '92%', 
      formula: 'C8HF15O4S', 
      type: 'linear',
      fragments: ['m/z 145.02', 'm/z 223.11'],
      desc: '线性结构，符合全氟醚键特征，毒性预测值较高。',
      color: '#f87171' // red tint
   },
   { 
      name: '结构异构体 B', 
      match: '68%', 
      formula: 'C8HF15O4S', 
      type: 'branched',
      fragments: ['m/z 119.01', 'm/z 223.11'],
      desc: '支链结构，碎片模式匹配度一般，可能是降解中间体。',
      color: '#fbbf24' // amber tint
   },
   { 
      name: '同系物 C4', 
      match: '45%', 
      formula: 'C4HF7O4S', 
      type: 'short-chain',
      fragments: ['m/z 99.02'],
      desc: '短链同系物，质量数偏差较大。',
      color: '#94a3b8' // slate
   },
];

const RiskAssessmentContent: React.FC = () => {
   const riskData = [
     { subject: '持久性 (P)', A: 90, fullMark: 100 },
     { subject: '生物富集 (B)', A: 85, fullMark: 100 },
     { subject: '水生毒性 (T)', A: 65, fullMark: 100 },
     { subject: '人体健康', A: 40, fullMark: 100 },
     { subject: '迁移性', A: 70, fullMark: 100 },
     { subject: '转化产物风险', A: 80, fullMark: 100 },
   ];
 
   const regulations = [
     { code: 'GB 5749-2022', name: '生活饮用水卫生标准', status: 'pass', desc: '预测浓度低于限值 (0.005 mg/L)' },
     { code: 'Stockholm Convention', name: '斯德哥尔摩公约', status: 'warning', desc: '结构具有 POPs 特征，建议持续关注' },
     { code: 'EPA MCL', name: '美国环保署最大污染物水平', status: 'fail', desc: '超过建议限值，需优先管控' },
   ];
 
   return (
     <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-300">
       <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          {/* Left: Risk Radar */}
          <div className="col-span-5 bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col">
             <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
               <Scale className="w-4 h-4 text-blue-400" /> 综合风险画像
             </h3>
             <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="70%" data={riskData}>
                      <PolarGrid stroke="#475569" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                         name="C-109 Risk Profile"
                         dataKey="A"
                         stroke="#ef4444"
                         strokeWidth={2}
                         fill="#ef4444"
                         fillOpacity={0.3}
                      />
                   </RadarChart>
                </ResponsiveContainer>
                
                {/* Risk Level Badge */}
                <div className="absolute top-0 right-0 bg-red-900/30 border border-red-500/50 px-3 py-1.5 rounded text-center">
                   <div className="text-xs text-red-300 uppercase font-bold">Risk Level</div>
                   <div className="text-xl font-bold text-red-500">HIGH</div>
                </div>
             </div>
             
             <div className="mt-4 bg-slate-900/50 p-3 rounded border border-slate-700 text-xs text-slate-400 leading-relaxed">
                <span className="text-red-400 font-bold">评估摘要：</span> 该化合物表现出显著的持久性 (P) 和生物富集性 (B) 特征。虽然其直接人体健康风险评分中等，但其环境转化产物具有更高的毒性潜势。建议纳入<span className="text-slate-200 underline cursor-pointer">优先管控名录</span>。
             </div>
          </div>
 
          {/* Right: Regulations & Uncertainty */}
          <div className="col-span-7 flex flex-col gap-6">
             
             {/* Regulations */}
             <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
                <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-green-400" /> 法规标准对照分析
                </h3>
                <div className="space-y-3">
                   {regulations.map((reg, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-3 rounded border border-slate-700">
                         <div>
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-200">{reg.code}</span>
                               <span className="text-xs text-slate-500">{reg.name}</span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">{reg.desc}</div>
                         </div>
                         <div>
                            {reg.status === 'pass' && <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded border border-green-700">符合标准</span>}
                            {reg.status === 'warning' && <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded border border-yellow-700">预警</span>}
                            {reg.status === 'fail' && <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded border border-red-700">超标风险</span>}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
 
             {/* Uncertainty & Actions */}
             <div className="flex-1 grid grid-cols-2 gap-6">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
                   <h3 className="text-sm font-bold text-orange-400 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> 不确定性说明
                   </h3>
                   <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex gap-2">
                         <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 shrink-0"></span>
                         <p>毒性数据基于 QSAR 预测，缺乏体内实验数据支持 (Confidence: 75%)。</p>
                      </div>
                      <div className="flex gap-2">
                         <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 shrink-0"></span>
                         <p>环境转化路径存在分支未确认，可能生成未知中间体。</p>
                      </div>
                   </div>
                </div>
 
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col">
                   <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-400" /> 下一步决策建议
                   </h3>
                   <div className="space-y-2 flex-1">
                      <button className="w-full text-left px-3 py-2 bg-blue-600/20 border border-blue-500/50 rounded text-blue-200 text-xs hover:bg-blue-600/30 transition-colors">
                         1. 启动微流控斑马鱼毒性验证实验
                      </button>
                      <button className="w-full text-left px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-slate-300 text-xs hover:bg-slate-700 transition-colors">
                         2. 增加监测频次 (由每周 → 每日)
                      </button>
                   </div>
                </div>
             </div>
 
          </div>
       </div>
     </div>
   );
};

const Analysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'structure' | 'risk'>('structure');
  const [selectedIsomerIndex, setSelectedIsomerIndex] = useState(0);
  const currentIsomer = isomerData[selectedIsomerIndex];

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
         <div>
           <h2 className="text-xl font-bold text-slate-100 flex items-center gap-3">
             结构与机理分析
             <span className="px-2 py-0.5 rounded text-sm bg-blue-600/20 text-blue-400 border border-blue-600/30">C-109</span>
           </h2>
           <p className="text-sm text-slate-400 mt-1">集成化学结构解析、路径推演与多维风险评估</p>
         </div>
         <div className="flex items-center gap-4">
            <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex">
               <button 
                  onClick={() => setActiveTab('structure')}
                  className={`px-4 py-1.5 text-sm rounded transition-all ${activeTab === 'structure' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
               >
                  结构与路径
               </button>
               <button 
                  onClick={() => setActiveTab('risk')}
                  className={`px-4 py-1.5 text-sm rounded transition-all flex items-center gap-2 ${activeTab === 'risk' ? 'bg-red-900/30 text-red-400 border border-red-900/50' : 'text-slate-400 hover:text-slate-200'}`}
               >
                  <ShieldAlert className="w-3.5 h-3.5" /> 风险评估
               </button>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-500 shadow-lg shadow-blue-900/50 flex items-center gap-2">
               <Download className="w-4 h-4" /> 导出报告
            </button>
         </div>
      </div>

      {activeTab === 'risk' ? (
         <RiskAssessmentContent />
      ) : (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 animate-in fade-in duration-300">
           {/* Left: Structure Inference */}
           <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-slate-100 font-semibold text-sm">分子结构智能推断</h3>
                <div className="flex gap-2 text-xs">
                   <span className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
                       parseInt(currentIsomer.match) > 80 
                       ? 'text-green-400 bg-green-900/20 border-green-800' 
                       : 'text-yellow-400 bg-yellow-900/20 border-yellow-800'
                   }`}>
                     <CheckCircle2 className="w-3 h-3" /> 置信度 {currentIsomer.match}
                   </span>
                </div>
             </div>
             
             <div className="flex-1 bg-slate-900 rounded border border-slate-700 relative overflow-hidden flex items-center justify-center p-8 transition-colors duration-500">
                {/* Simulated Molecule Visualization using SVG */}
                <svg width="400" height="200" viewBox="0 0 400 200" className="opacity-90 hover:opacity-100 transition-opacity duration-500">
                   {/* Dynamic Molecule Structure based on selection (Mock visual changes) */}
                   {currentIsomer.type === 'linear' && (
                     <g>
                       <line x1="100" y1="100" x2="150" y2="100" stroke="#94a3b8" strokeWidth="4" />
                       <line x1="150" y1="100" x2="180" y2="60" stroke="#94a3b8" strokeWidth="4" />
                       <line x1="180" y1="60" x2="230" y2="60" stroke="#94a3b8" strokeWidth="4" />
                       <line x1="230" y1="60" x2="260" y2="100" stroke="#94a3b8" strokeWidth="4" />
                       <line x1="260" y1="100" x2="310" y2="100" stroke="#94a3b8" strokeWidth="4" />
                       <circle cx="100" cy="100" r="15" fill="#f87171" /><text x="100" y="105" textAnchor="middle" fill="white" fontSize="12">F</text>
                       <circle cx="150" cy="100" r="15" fill="#64748b" /><text x="150" y="105" textAnchor="middle" fill="white" fontSize="12">C</text>
                       <circle cx="180" cy="60" r="15" fill="#ef4444" /><text x="180" y="65" textAnchor="middle" fill="white" fontSize="12">O</text>
                       <circle cx="230" cy="60" r="15" fill="#64748b" /><text x="230" y="65" textAnchor="middle" fill="white" fontSize="12">C</text>
                       <circle cx="260" cy="100" r="15" fill="#64748b" /><text x="260" y="105" textAnchor="middle" fill="white" fontSize="12">C</text>
                       <circle cx="310" cy="100" r="15" fill="#eab308" /><text x="310" y="105" textAnchor="middle" fill="black" fontSize="12">S</text>
                     </g>
                   )}
                   {currentIsomer.type === 'branched' && (
                     <g transform="translate(20,0)">
                        <line x1="120" y1="120" x2="150" y2="90" stroke="#94a3b8" strokeWidth="4" />
                        <line x1="150" y1="90" x2="180" y2="120" stroke="#94a3b8" strokeWidth="4" />
                        <line x1="150" y1="90" x2="150" y2="50" stroke="#94a3b8" strokeWidth="4" /> {/* Branch */}
                        <circle cx="120" cy="120" r="15" fill="#f87171" />
                        <circle cx="150" cy="90" r="15" fill="#64748b" />
                        <circle cx="180" cy="120" r="15" fill="#ef4444" />
                        <circle cx="150" cy="50" r="15" fill="#64748b" />
                     </g>
                   )}
                   {currentIsomer.type === 'short-chain' && (
                     <g transform="translate(50,20)">
                       <line x1="100" y1="100" x2="150" y2="100" stroke="#94a3b8" strokeWidth="4" />
                       <circle cx="100" cy="100" r="15" fill="#f87171" />
                       <circle cx="150" cy="100" r="15" fill="#64748b" />
                     </g>
                   )}
                </svg>
   
                {/* Annotation */}
                <div className="absolute top-4 right-4 bg-slate-800/80 p-3 rounded text-xs border border-slate-600 backdrop-blur-sm w-48">
                   <div className="text-slate-400 mb-1">推断分子式</div>
                   <div className="text-lg font-mono text-white mb-2">{currentIsomer.formula}</div>
                   <div className="text-slate-400 mb-1">结构描述</div>
                   <div className="text-slate-300 leading-tight mb-2">{currentIsomer.desc}</div>
                   <div className="text-slate-400 mb-1">碎片依据</div>
                   <div className="flex flex-wrap gap-1">
                      {currentIsomer.fragments.map(frag => (
                         <span key={frag} className="bg-blue-900/50 text-blue-300 px-1 rounded">{frag}</span>
                      ))}
                   </div>
                </div>
             </div>
   
             <div className="mt-4 grid grid-cols-3 gap-4">
                {isomerData.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedIsomerIndex(idx)}
                    className={`p-3 rounded border text-center text-sm cursor-pointer transition-all ${
                      selectedIsomerIndex === idx 
                        ? 'bg-blue-600/20 border-blue-500 text-blue-100 ring-1 ring-blue-500/50' 
                        : 'bg-slate-700/30 border-slate-600 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                     {item.name}
                     {idx === selectedIsomerIndex && <div className="text-xs text-blue-400 mt-1">Match: {item.match}</div>}
                  </div>
                ))}
             </div>
           </div>
   
           {/* Right: Pathway Inference */}
           <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col">
              <h3 className="text-slate-100 font-semibold mb-4 text-sm">环境转化路径推演</h3>
              
              <div className="flex-1 relative space-y-6 pl-4 border-l-2 border-slate-700 ml-3 py-2">
                 <div className="relative">
                    <div className="absolute -left-[25px] top-0 bg-blue-600 w-4 h-4 rounded-full border-4 border-slate-800"></div>
                    <h4 className="text-sm font-medium text-blue-400">初始排放</h4>
                    <p className="text-xs text-slate-400 mt-1">来源于工业废水排放，主要以阴离子形式存在。</p>
                 </div>
   
                 <div className="relative">
                    <div className="absolute -left-[25px] top-0 bg-slate-600 w-4 h-4 rounded-full border-4 border-slate-800"></div>
                    <h4 className="text-sm font-medium text-slate-200">光化学转化 (Photolysis)</h4>
                    <div className="mt-2 bg-slate-900 p-2 rounded border border-slate-700 text-xs">
                       <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <span>Rate Constant (k):</span>
                          <span className="text-mono text-slate-200">
                             {currentIsomer.type === 'linear' ? '0.045 d⁻¹' : '0.082 d⁻¹'}
                          </span>
                       </div>
                       <p className="text-slate-500">
                          {currentIsomer.type === 'linear' 
                             ? '在 UV 辐射下醚键断裂，生成短链全氟化合物。' 
                             : '支链结构更不稳定，易发生脱氟反应。'}
                       </p>
                    </div>
                 </div>
   
                 <div className="relative">
                    <div className="absolute -left-[25px] top-0 bg-orange-600 w-4 h-4 rounded-full border-4 border-slate-800 animate-pulse"></div>
                    <h4 className="text-sm font-medium text-orange-400">生物富集 (Bioaccumulation)</h4>
                    <div className="mt-2 bg-slate-900 p-2 rounded border border-slate-700 text-xs">
                       <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <span>BCF (Fish):</span>
                          <span className="text-mono text-orange-300">
                            {currentIsomer.type === 'linear' ? '3200 L/kg' : '1850 L/kg'}
                          </span>
                       </div>
                       <p className="text-slate-500">
                          {currentIsomer.type === 'linear' 
                            ? '疏水性较强，易在水生生物脂肪组织中累积。' 
                            : '支链结构代谢半衰期较短，累积潜力中等。'}
                       </p>
                    </div>
                 </div>
                 
                 <div className="flex items-center justify-center mt-4">
                    <button className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300">
                       <Share2 className="w-3 h-3" />
                       查看完整因果图
                    </button>
                 </div>
              </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default Analysis;
