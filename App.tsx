import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DevicePanel from './components/Layout/DevicePanel';
import RightPanel from './components/Layout/RightPanel';
import Dashboard from './modules/Dashboard';
import Discovery from './modules/Discovery';
import Analysis from './modules/Analysis';
import AIConfig from './modules/AIConfig';
import TaskTopology from './modules/TaskTopology';
import TaskManagement from './modules/NewTask'; 
import KnowledgeCenter from './modules/KnowledgeCenter';
import Simulation from './modules/Simulation';
// RiskAssessment removed as standalone module
import { ModuleType } from './types';
import { AlertOctagon } from 'lucide-react';

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.DASHBOARD);
  const [showRightPanel, setShowRightPanel] = useState(true);

  // Function to handle switching to task detail view
  const handleTaskClick = (taskId: string) => {
    setCurrentModule(ModuleType.TASK_DETAIL);
  };

  const renderContent = () => {
    switch (currentModule) {
      case ModuleType.TASK_MANAGE:
        return <TaskManagement />;
      case ModuleType.DASHBOARD:
        return <Dashboard onTaskClick={handleTaskClick} />;
      case ModuleType.DISCOVERY:
        return <Discovery />;
      case ModuleType.ANALYSIS:
        return <Analysis />;
      case ModuleType.SIMULATION:
        return <Simulation />;
      case ModuleType.AI_CONFIG:
        return <AIConfig />;
      case ModuleType.KNOWLEDGE:
        return <KnowledgeCenter />;
      case ModuleType.TASK_DETAIL:
        return <TaskTopology onBack={() => setCurrentModule(ModuleType.DASHBOARD)} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
             <AlertOctagon className="w-12 h-12 mb-4 opacity-50" />
             <h3 className="text-lg font-medium">该模块正在建设中 (Mock Placeholder)</h3>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* 1. Left Navigation (Hidden in Topology View for immersion) */}
      {currentModule !== ModuleType.TASK_DETAIL && (
        <Sidebar currentModule={currentModule} onModuleChange={setCurrentModule} />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Top Header (Hidden in Topology View) */}
        {currentModule !== ModuleType.TASK_DETAIL && <Header />}

        {/* 3. Workspace */}
        <div className="flex-1 flex overflow-hidden relative">
           
           <main className="flex-1 relative overflow-hidden bg-slate-900/50">
             {renderContent()}
           </main>

           {/* 4. Right Panel (Collapsible - Only show in analysis/standard views) */}
           {showRightPanel && (currentModule === ModuleType.DASHBOARD || currentModule === ModuleType.DISCOVERY || currentModule === ModuleType.ANALYSIS) && (
             <RightPanel />
           )}
           
           {/* Toggle for right panel (absolute positioned) */}
           {(currentModule === ModuleType.DASHBOARD || currentModule === ModuleType.DISCOVERY || currentModule === ModuleType.ANALYSIS) && (
             <button 
               onClick={() => setShowRightPanel(!showRightPanel)}
               className="absolute right-0 top-1/2 -translate-y-1/2 bg-slate-800 border border-slate-600 p-1 rounded-l text-slate-400 hover:text-white z-20"
               style={{ right: showRightPanel ? '320px' : '0' }}
             >
               {showRightPanel ? '›' : '‹'}
             </button>
           )}
        </div>

        {/* 5. Bottom Device Status */}
        <DevicePanel />
      </div>
    </div>
  );
};

export default App;