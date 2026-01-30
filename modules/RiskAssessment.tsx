import React from 'react';
import { 
  ShieldAlert, AlertTriangle, FileCheck, Info, 
  ArrowRight, Download, BookOpen, Scale
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const RiskAssessment: React.FC = () => {
  
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
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
           <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
             <ShieldAlert className="w-6 h-6 text-red-500" />
             风险评估与决策支持
           </h2>
           <p className="text-sm text-slate-400 mt-1">候选物 C-109 (PFESA 同系物) 多维风险画像与管控建议</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-600 text-slate-300 rounded text-sm hover:bg-slate-700 transition-colors">
             <Download className="w-4 h-4" /> 导出评估报告
          </button>
        </div>
      </div>

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

export default RiskAssessment;
