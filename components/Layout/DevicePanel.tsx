import React from 'react';
import { Device, DeviceStatus } from '../../types';
import { Server, Thermometer, Droplets, Activity, AlertTriangle } from 'lucide-react';

const devices: Device[] = [
  { id: '1', name: 'Q-TOF MS (高分辨质谱)', type: 'detection', status: DeviceStatus.RUNNING, currentTask: 'Sample_Batch_A04' },
  { id: '2', name: 'Auto-SPE (固相萃取)', type: 'processing', status: DeviceStatus.WAITING },
  { id: '3', name: '光化学反应釜-01', type: 'reaction', status: DeviceStatus.IDLE },
  { id: '4', name: '毒性微流控芯片组', type: 'bio', status: DeviceStatus.ERROR, currentTask: 'Bio_Assay_X2' },
];

const getStatusColor = (status: DeviceStatus) => {
  switch (status) {
    case DeviceStatus.RUNNING: return 'text-green-400 border-green-500/30 bg-green-500/10';
    case DeviceStatus.WAITING: return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    case DeviceStatus.ERROR: return 'text-red-400 border-red-500/30 bg-red-500/10';
    default: return 'text-slate-400 border-slate-600/30 bg-slate-700/10';
  }
};

const getIcon = (type: string) => {
  switch(type) {
    case 'detection': return <Activity className="w-4 h-4" />;
    case 'processing': return <Droplets className="w-4 h-4" />;
    case 'reaction': return <Thermometer className="w-4 h-4" />;
    default: return <Server className="w-4 h-4" />;
  }
};

const DevicePanel: React.FC = () => {
  return (
    <div className="h-14 bg-slate-900 border-t border-slate-700 flex items-center px-6 gap-6 overflow-x-auto shrink-0">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">设备实时态势</div>
      {devices.map(device => (
        <div key={device.id} className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs whitespace-nowrap ${getStatusColor(device.status)}`}>
          {getIcon(device.type)}
          <span className="font-medium">{device.name}</span>
          <span className="opacity-70 px-1">|</span>
          <span className="uppercase">{device.status}</span>
          {device.status === DeviceStatus.ERROR && (
             <AlertTriangle className="w-3.5 h-3.5 ml-1 animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
};

export default DevicePanel;