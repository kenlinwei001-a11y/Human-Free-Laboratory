import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Wind, Zap, Thermometer, Activity, Layers, FlaskConical, Droplets, Timer } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

const Simulation: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100%
  const [time, setTime] = useState(0); // minutes
  
  // Simulation Parameters
  const [params, setParams] = useState({
    uvIntensity: 80, // W/m2
    catalystLoading: 1.5, // g/L
    phLevel: 7.0,
    temperature: 25, // °C
  });

  // Chart Data State
  const [chartData, setChartData] = useState<{time: number, c_c0: number, intermediate: number}[]>([
    { time: 0, c_c0: 1.0, intermediate: 0 }
  ]);

  const animationRef = useRef<number>(0);

  const resetSimulation = () => {
    setIsRunning(false);
    setProgress(0);
    setTime(0);
    setChartData([{ time: 0, c_c0: 1.0, intermediate: 0 }]);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  // Simulation Loop
  useEffect(() => {
    if (isRunning) {
      let lastTime = Date.now();
      const loop = () => {
        const now = Date.now();
        const dt = (now - lastTime) / 1000; // seconds
        lastTime = now;

        setTime(prev => {
           const newTime = prev + dt * 2; // Speed up time 2x
           
           // Calculate Kinetics based on params (Simplified Langmuir-Hinshelwood model mock)
           // k is proportional to UV and Catalyst, affected by pH deviation from neutral
           const phFactor = 1 - Math.abs(params.phLevel - 7) * 0.1;
           const k = 0.05 * (params.uvIntensity / 100) * (params.catalystLoading) * phFactor; 
           
           // Update Chart Data
           setChartData(currentData => {
             const lastEntry = currentData[currentData.length - 1];
             if (newTime - lastEntry.time > 1) { // Add point every virtual minute
                const decay = Math.exp(-k * newTime);
                const inter = (1 - decay) * Math.exp(-0.1 * newTime); // Simplified intermediate curve
                return [...currentData, { time: Number(newTime.toFixed(1)), c_c0: Number(decay.toFixed(3)), intermediate: Number(inter.toFixed(3)) }];
             }
             return currentData;
           });

           // Update Progress (Stop at 60 mins)
           if (newTime >= 60) {
             setIsRunning(false);
             return 60;
           }
           
           setProgress((newTime / 60) * 100);
           return newTime;
        });

        animationRef.current = requestAnimationFrame(loop);
      };
      animationRef.current = requestAnimationFrame(loop);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isRunning, params]);

  // Derived Metrics
  const removalRate = ((1 - (chartData[chartData.length - 1]?.c_c0 || 1)) * 100).toFixed(1);
  const energyConsumption = (time * (params.uvIntensity * 0.5) / 60).toFixed(2); // Mock calculation

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
         <div>
           <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
             <FlaskConical className="w-6 h-6 text-blue-400" />
             治理技术仿真验证 (Governance Simulation)
           </h2>
           <p className="text-sm text-slate-400 mt-1">模拟高级氧化工艺 (AOPs) 对新污染物 C-109 的降解效果</p>
         </div>
         <div className="flex gap-3">
            <button onClick={resetSimulation} className="p-2 bg-slate-800 border border-slate-700 text-slate-300 rounded hover:bg-slate-700 hover:text-white transition-colors">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleSimulation}
              className={`flex items-center gap-2 px-6 py-2 rounded font-medium text-white transition-all shadow-lg ${
                isRunning 
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/50' 
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/50'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? '暂停仿真' : '开始仿真'}
            </button>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* 1. Left: Parameter Control Panel */}
        <div className="col-span-3 bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col overflow-y-auto">
           <h3 className="text-sm font-bold text-slate-200 uppercase mb-6 flex items-center gap-2">
             <Settings className="w-4 h-4 text-slate-400" /> 工艺参数设定
           </h3>

           <div className="space-y-8">
             {/* UV Intensity */}
             <div className="space-y-3">
               <div className="flex justify-between text-xs">
                 <span className="text-slate-400 flex items-center gap-1"><Zap className="w-3 h-3" /> 紫外光强 (UV)</span>
                 <span className="text-blue-400 font-mono">{params.uvIntensity} W/m²</span>
               </div>
               <input 
                 type="range" min="0" max="200" step="10"
                 value={params.uvIntensity}
                 onChange={(e) => setParams({...params, uvIntensity: Number(e.target.value)})}
                 className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
               />
               <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                 <span>0</span><span>200</span>
               </div>
             </div>

             {/* Catalyst Loading */}
             <div className="space-y-3">
               <div className="flex justify-between text-xs">
                 <span className="text-slate-400 flex items-center gap-1"><Layers className="w-3 h-3" /> 催化剂投加量</span>
                 <span className="text-green-400 font-mono">{params.catalystLoading} g/L</span>
               </div>
               <input 
                 type="range" min="0.1" max="5.0" step="0.1"
                 value={params.catalystLoading}
                 onChange={(e) => setParams({...params, catalystLoading: Number(e.target.value)})}
                 className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-green-500"
               />
               <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                 <span>0.1</span><span>5.0</span>
               </div>
             </div>

             {/* pH Level */}
             <div className="space-y-3">
               <div className="flex justify-between text-xs">
                 <span className="text-slate-400 flex items-center gap-1"><Droplets className="w-3 h-3" /> 初始 pH 值</span>
                 <span className="text-purple-400 font-mono">{params.phLevel}</span>
               </div>
               <input 
                 type="range" min="3" max="11" step="0.5"
                 value={params.phLevel}
                 onChange={(e) => setParams({...params, phLevel: Number(e.target.value)})}
                 className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
               />
               <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                 <span>3.0</span><span>11.0</span>
               </div>
             </div>

             {/* Temperature */}
             <div className="space-y-3">
               <div className="flex justify-between text-xs">
                 <span className="text-slate-400 flex items-center gap-1"><Thermometer className="w-3 h-3" /> 反应温度</span>
                 <span className="text-orange-400 font-mono">{params.temperature} °C</span>
               </div>
               <input 
                 type="range" min="15" max="60" step="1"
                 value={params.temperature}
                 onChange={(e) => setParams({...params, temperature: Number(e.target.value)})}
                 className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
               />
               <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                 <span>15</span><span>60</span>
               </div>
             </div>
           </div>

           <div className="mt-auto pt-6 border-t border-slate-700">
              <div className="bg-slate-900/50 p-3 rounded text-xs text-slate-400 leading-relaxed">
                 <span className="text-blue-400 font-bold">仿真模型说明：</span> 基于 Langmuir-Hinshelwood 动力学模型，结合 C-109 的量子化学计算参数（HOMO-LUMO 能隙）进行推演。
              </div>
           </div>
        </div>

        {/* 2. Center: Digital Twin Reactor */}
        <div className="col-span-5 flex flex-col gap-6">
           <div className="flex-1 bg-slate-900 rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
              
              {/* Reactor Info Overlay */}
              <div className="absolute top-4 left-4 z-10">
                 <div className="bg-black/40 backdrop-blur px-3 py-1.5 rounded border border-slate-700 text-xs text-slate-300 font-mono mb-2">
                    Reactor Status: {isRunning ? <span className="text-green-400">ACTIVE</span> : <span className="text-slate-500">STANDBY</span>}
                 </div>
                 <div className="bg-black/40 backdrop-blur px-3 py-1.5 rounded border border-slate-700 text-xs text-slate-300 font-mono">
                    Time: <span className="text-white text-sm">{time.toFixed(1)} min</span>
                 </div>
              </div>

              {/* Reactor SVG Visualization */}
              <svg width="300" height="400" viewBox="0 0 300 400" className="relative z-0">
                 {/* Reaction Vessel Glass */}
                 <path d="M 80 50 L 80 350 Q 80 380 150 380 Q 220 380 220 350 L 220 50" fill="none" stroke="#94a3b8" strokeWidth="4" opacity="0.5" />
                 
                 {/* Liquid Level - Changes opacity based on removal rate */}
                 <defs>
                   <linearGradient id="liquidGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8 * (chartData[chartData.length-1]?.c_c0 || 1)} />
                     <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.9 * (chartData[chartData.length-1]?.c_c0 || 1)} />
                   </linearGradient>
                   <filter id="glow">
                      <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                      <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                   </filter>
                 </defs>
                 
                 {/* Liquid Body */}
                 <path d="M 85 100 L 85 350 Q 85 375 150 375 Q 215 375 215 350 L 215 100 Z" fill="url(#liquidGradient)" />

                 {/* UV Lamp (Center) */}
                 <rect x="140" y="30" width="20" height="320" rx="5" fill="#f8fafc" opacity={isRunning ? 1 : 0.3} filter={isRunning ? "url(#glow)" : ""} />
                 {isRunning && (
                   <g>
                     {/* Light Rays */}
                     <line x1="130" y1="100" x2="90" y2="100" stroke="#c084fc" strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite" /></line>
                     <line x1="170" y1="150" x2="210" y2="150" stroke="#c084fc" strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" begin="0.5s" repeatCount="indefinite" /></line>
                     <line x1="130" y1="200" x2="90" y2="200" stroke="#c084fc" strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" begin="1s" repeatCount="indefinite" /></line>
                     <line x1="170" y1="250" x2="210" y2="250" stroke="#c084fc" strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" begin="1.5s" repeatCount="indefinite" /></line>
                   </g>
                 )}

                 {/* Bubbles (Aeration) */}
                 {isRunning && (
                    <g fill="#e0f2fe" opacity="0.6">
                       <circle cx="100" cy="350" r="3"><animate attributeName="cy" from="350" to="100" dur="3s" repeatCount="indefinite" /></circle>
                       <circle cx="120" cy="360" r="2"><animate attributeName="cy" from="360" to="100" dur="2.5s" begin="0.2s" repeatCount="indefinite" /></circle>
                       <circle cx="180" cy="355" r="4"><animate attributeName="cy" from="355" to="100" dur="3.2s" begin="0.5s" repeatCount="indefinite" /></circle>
                       <circle cx="200" cy="365" r="2"><animate attributeName="cy" from="365" to="100" dur="2.8s" begin="0.8s" repeatCount="indefinite" /></circle>
                    </g>
                 )}
                 
                 {/* Stirrer */}
                 <rect x="110" y="360" width="80" height="8" rx="2" fill="#cbd5e1">
                    {isRunning && <animateTransform attributeName="transform" type="rotate" from="0 150 364" to="360 150 364" dur="0.5s" repeatCount="indefinite" />}
                 </rect>
              </svg>
           </div>
           
           {/* Key Metrics Cards */}
           <div className="h-24 grid grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex flex-col justify-center items-center">
                 <div className="text-slate-400 text-xs uppercase mb-1">去除率 (Removal)</div>
                 <div className="text-2xl font-bold text-blue-400">{removalRate}<span className="text-sm text-slate-500 ml-1">%</span></div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex flex-col justify-center items-center">
                 <div className="text-slate-400 text-xs uppercase mb-1">反应速率常数 (k)</div>
                 <div className="text-2xl font-bold text-green-400">0.042<span className="text-sm text-slate-500 ml-1">min⁻¹</span></div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex flex-col justify-center items-center">
                 <div className="text-slate-400 text-xs uppercase mb-1">能耗 (Energy)</div>
                 <div className="text-2xl font-bold text-orange-400">{energyConsumption}<span className="text-sm text-slate-500 ml-1">kWh</span></div>
              </div>
           </div>
        </div>

        {/* 3. Right: Analytics Charts */}
        <div className="col-span-4 flex flex-col gap-6">
           {/* Concentration Decay Curve */}
           <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col">
              <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                 <Activity className="w-4 h-4 text-blue-400" /> 降解动力学曲线
              </h3>
              <div className="flex-1 w-full min-h-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                       <XAxis 
                         dataKey="time" 
                         type="number" 
                         domain={[0, 60]} 
                         stroke="#94a3b8" 
                         fontSize={12} 
                         label={{ value: 'Time (min)', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 10 }}
                       />
                       <YAxis 
                         stroke="#94a3b8" 
                         fontSize={12} 
                         label={{ value: 'C/C0', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                       />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }} 
                         itemStyle={{ color: '#fff' }}
                         labelStyle={{ color: '#94a3b8' }}
                       />
                       <Line type="monotone" dataKey="c_c0" stroke="#3b82f6" strokeWidth={2} dot={false} name="污染物浓度" />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Intermediates Evolution */}
           <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col">
              <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                 <Wind className="w-4 h-4 text-purple-400" /> 中间产物生成趋势
              </h3>
              <div className="flex-1 w-full min-h-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                       <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                       <YAxis stroke="#94a3b8" fontSize={12} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }} 
                       />
                       <Area type="monotone" dataKey="intermediate" stroke="#c084fc" fill="#c084fc" fillOpacity={0.2} name="中间产物总量" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Simulation;