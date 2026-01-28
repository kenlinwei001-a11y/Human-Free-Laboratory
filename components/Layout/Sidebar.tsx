import React from 'react';
import { ModuleType } from '../../types';
import { 
  LayoutDashboard, 
  Search, 
  Microscope, 
  ShieldAlert, 
  FlaskConical, 
  Bot, 
  Settings,
  PlusCircle,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  currentModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentModule, onModuleChange }) => {
  const menuItems = [
    { id: ModuleType.DASHBOARD, label: '态势总览', icon: LayoutDashboard },
    { id: ModuleType.NEW_TASK, label: '新建任务', icon: PlusCircle, highlight: true }, // New
    { id: ModuleType.KNOWLEDGE, label: '算法与知识', icon: BookOpen }, // New
    { id: ModuleType.DISCOVERY, label: '发现与筛选', icon: Search },
    { id: ModuleType.ANALYSIS, label: '结构与机理', icon: Microscope },
    { id: ModuleType.RISK, label: '风险评估', icon: ShieldAlert },
    { id: ModuleType.SIMULATION, label: '治理仿真', icon: FlaskConical },
    { id: ModuleType.AI_CONFIG, label: '智能配置', icon: Bot },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <FlaskConical className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-slate-100 text-sm tracking-wide">新污染物</h1>
          <div className="text-xs text-blue-400">无人实验室智能平台</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase px-3 mb-2 mt-2">工作台</div>
        {menuItems.slice(0, 3).map((item) => (
          <button
            key={item.id}
            onClick={() => onModuleChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors ${
              currentModule === item.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                : item.highlight 
                  ? 'text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
            {currentModule === item.id && !item.highlight && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            )}
          </button>
        ))}

        <div className="text-xs font-semibold text-slate-500 uppercase px-3 mb-2 mt-6">实验工序</div>
        {menuItems.slice(3).map((item) => (
          <button
            key={item.id}
            onClick={() => onModuleChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors ${
              currentModule === item.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
            {currentModule === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded p-3 text-xs text-slate-400">
          <div className="flex justify-between mb-1">
            <span>系统状态</span>
            <span className="text-green-400">稳定运行</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
          </div>
          <div className="mt-1 text-right">CPU 32%</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;