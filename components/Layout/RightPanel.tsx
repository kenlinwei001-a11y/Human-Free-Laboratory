import React from 'react';
import { Lightbulb, FileText, AlertCircle, Link, MessageSquare } from 'lucide-react';

const RightPanel: React.FC = () => {
  return (
    <div className="w-80 bg-slate-900 border-l border-slate-700 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-slate-100 font-semibold flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          智能推演依据
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Agent Reasoning */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-blue-400 uppercase flex items-center gap-1">
             <MessageSquare className="w-3 h-3" />
             当前结论来源
          </div>
          <div className="bg-slate-800/50 p-3 rounded border border-slate-700 text-sm text-slate-300 leading-relaxed">
            <span className="text-purple-400 font-medium">结构解析智能体</span> 基于 MS/MS 碎片离子特征 (m/z 145.02, 223.11) 推断，候选物 X-21 含有 <span className="text-white bg-slate-700 px-1 rounded">全氟烷基链</span> 结构，置信度 87%。
          </div>
        </div>

        {/* Evidence Links */}
        <div className="space-y-2">
           <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
             <FileText className="w-3 h-3" />
             支撑文献与法规
          </div>
           <ul className="space-y-2">
             <li className="flex items-start gap-2 text-xs text-slate-400 hover:text-blue-400 cursor-pointer p-2 hover:bg-slate-800 rounded transition-colors">
                <Link className="w-3 h-3 mt-0.5" />
                <span>GB 5749-2022 生活饮用水卫生标准 (引用条款 A.2)</span>
             </li>
             <li className="flex items-start gap-2 text-xs text-slate-400 hover:text-blue-400 cursor-pointer p-2 hover:bg-slate-800 rounded transition-colors">
                <Link className="w-3 h-3 mt-0.5" />
                <span>Env. Sci. Technol. 2023, 57, 12, 4567–4578</span>
             </li>
           </ul>
        </div>

        {/* Uncertainty Alert */}
        <div className="bg-orange-900/20 border border-orange-700/30 p-3 rounded">
          <div className="flex items-center gap-2 text-orange-400 text-sm font-semibold mb-1">
            <AlertCircle className="w-4 h-4" />
            不确定性提示
          </div>
          <p className="text-xs text-orange-200/80">
            该化合物的毒性数据缺乏实测值，当前结果基于 QSAR 模型预测，可能存在 15-20% 的偏差。建议启动微流控斑马鱼胚胎毒性实验进行验证。
          </p>
        </div>
        
         <div className="space-y-2 mt-6">
           <div className="text-xs font-bold text-slate-500 uppercase">模型调用记录</div>
           <div className="text-xs text-slate-400 font-mono bg-black/30 p-2 rounded">
             <div>[10:42:15] 传神任度 > 结构特征提取</div>
             <div>[10:42:18] DeepSeek-Coder > 转化路径生成</div>
             <div>[10:42:25] Qwen-72B > 综合风险综述</div>
           </div>
         </div>
      </div>
    </div>
  );
};

export default RightPanel;