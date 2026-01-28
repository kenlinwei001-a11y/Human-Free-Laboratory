import React, { useState } from 'react';
import { AgentConfig, CHINESE_MODELS } from '../../types';
import { Bot, Cpu, GitBranch, Shield, Save } from 'lucide-react';

const initialAgents: AgentConfig[] = [
  { id: 'agent-1', name: '新污染物发现智能体', role: '发现与初筛', model: 'Qwen-72B (通义千问)', strategy: 'exploratory', isEnabled: true },
  { id: 'agent-2', name: '结构解析智能体', role: '分子结构推断', model: '传神任度大模型 (RenDu)', strategy: 'balanced', isEnabled: true },
  { id: 'agent-3', name: '风险评估智能体', role: '多维风险计算', model: 'DeepSeek-V2 (深度求索)', strategy: 'conservative', isEnabled: true },
  { id: 'agent-4', name: '实验调度智能体', role: '设备资源排期', model: 'GLM-4 (智谱AI)', strategy: 'conservative', isEnabled: false },
];

const AIConfig: React.FC = () => {
  const [agents, setAgents] = useState<AgentConfig[]>(initialAgents);

  const handleModelChange = (id: string, newModel: string) => {
    setAgents(prev => prev.map(agent => agent.id === id ? { ...agent, model: newModel } : agent));
  };

  const handleStrategyChange = (id: string, newStrategy: any) => {
    setAgents(prev => prev.map(agent => agent.id === id ? { ...agent, strategy: newStrategy } : agent));
  };

  const toggleAgent = (id: string) => {
    setAgents(prev => prev.map(agent => agent.id === id ? { ...agent, isEnabled: !agent.isEnabled } : agent));
  };

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-100 mb-2">智能能力配置 (AI Configuration)</h2>
        <p className="text-sm text-slate-400">管理各研究阶段的智能体角色、模型基座与决策策略。仅限使用经过合规验证的国产大模型。</p>
      </div>

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
              {/* Model Selection */}
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold mb-1.5 flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> 模型基座 (Model Base)
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

              {/* Strategy Selection */}
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold mb-1.5 flex items-center gap-1">
                  <GitBranch className="w-3 h-3" /> 决策策略 (Strategy)
                </label>
                <div className="grid grid-cols-3 gap-2">
                   {['conservative', 'balanced', 'exploratory'].map((strat) => (
                     <button
                       key={strat}
                       disabled={!agent.isEnabled}
                       onClick={() => handleStrategyChange(agent.id, strat)}
                       className={`text-xs py-1.5 rounded border capitalize transition-colors ${
                         agent.strategy === strat 
                           ? 'bg-blue-600/20 border-blue-500 text-blue-300' 
                           : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
                       }`}
                     >
                       {strat === 'conservative' ? '保守严谨' : strat === 'balanced' ? '平衡' : '探索创新'}
                     </button>
                   ))}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {agent.strategy === 'conservative' && '优先依赖已有知识库，减少幻觉，适用于风险评估。'}
                  {agent.strategy === 'balanced' && '在规则约束下进行适度推理，适用于结构解析。'}
                  {agent.strategy === 'exploratory' && '高发散性思维，寻找潜在关联，适用于新污染物发现。'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
         <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors">
            <Save className="w-4 h-4" />
            保存配置应用
         </button>
      </div>
    </div>
  );
};

export default AIConfig;