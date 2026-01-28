import React, { useState, useEffect } from 'react';
import { Bell, Activity, Database, Maximize, Minimize } from 'lucide-react';

const Header: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center gap-6">
        <div>
          <h2 className="text-slate-100 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            当前任务：长江流域典型抗生素替代品筛查 (Task-2024-X09)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 pl-4">
            目标：筛选具有高持久性风险的未知卤代化合物
          </p>
        </div>
        <div className="h-8 w-px bg-slate-700"></div>
        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded border border-slate-700">
          <Activity className="w-3.5 h-3.5 text-blue-400" />
          <span>推演进程：结构解析阶段 (45%)</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-900/30 border border-indigo-700/50 rounded text-indigo-300 text-xs">
           <Database className="w-3.5 h-3.5" />
           <span>知识库更新：2小时前</span>
        </div>
        
        <button 
          onClick={toggleFullscreen}
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
          title={isFullscreen ? "退出全屏" : "全屏模式"}
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>

        <button className="p-2 text-slate-400 hover:text-slate-100 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
        </button>
        
        <div className="flex items-center gap-2 pl-4 border-l border-slate-700">
           <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
             Dr.L
           </div>
           <div className="text-sm">
             <div className="text-slate-200">李研究员</div>
             <div className="text-xs text-slate-500">实验室负责人</div>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;