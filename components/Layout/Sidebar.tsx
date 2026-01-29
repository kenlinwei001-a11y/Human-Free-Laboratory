import React from 'react';
import { ModuleType } from '../../types';
import { 
  LayoutDashboard, 
  Search, 
  ShieldAlert, 
  FlaskConical, 
  Bot, 
  FolderKanban,
  Network
} from 'lucide-react';

interface SidebarProps {
  currentModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentModule, onModuleChange }) => {
  const menuItems = [
    { id: ModuleType.TASK_MANAGE, label: '项目管理', icon: FolderKanban, highlight: true },
    { id: ModuleType.DASHBOARD, label: '态势总览', icon: LayoutDashboard },
    { id: ModuleType.DISCOVERY, label: '发现与筛选', icon: Search },
    { id: ModuleType.SIMULATION, label: '数字仿真实验', icon: FlaskConical },
  ];

  const configItems = [
    { id: ModuleType.AI_CONFIG, label: 'AI 中台配置', icon: Bot },
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

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="text-xs font-semibold text-slate-500 uppercase px-3 mb-2 mt-2">核心功能</div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onModuleChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors ${
              currentModule === item.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                : item.highlight 
                  ? 'text-slate-200 hover:bg-slate-800 border border-transparent' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.highlight && currentModule !== item.id ? 'text-blue-500' : ''}`} />
            <span>{item.label}</span>
            {currentModule === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            )}
          </button>
        ))}

        <div className="text-xs font-semibold text-slate-500 uppercase px-3 mb-2 mt-6">基础设施</div>
        {configItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onModuleChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors ${
              currentModule === item.id
                ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded p-3 text-xs text-slate-400">
          <div className="flex justify-between mb-1">
            <span>系统状态</span>
            <span className="text-green-400 font-bold">推演中</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-green-500 h-1.5 rounded-full animate-pulse" style={{ width: '92%' }}></div>
          </div>
          <div className="mt-2 text-right opacity-70">Task-X09 Running...</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;