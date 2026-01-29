import React, { useState } from 'react';
import { Algorithm } from '../types';
import { Search, FileText, Code2, Download, ExternalLink, Cpu, BookOpen, Upload, Zap, Check, ChevronRight, Layers } from 'lucide-react';

const mockAlgorithms: Algorithm[] = [
  { 
    id: '1', name: 'NTS-PeakPick-V3', version: '3.2.1', type: 'screening', source: 'system', accuracy: '98.5%',
    description: '基于小波变换的非靶向筛查峰提取算法，优化了低信噪比下的特征识别能力。',
    modelArch: 'Wavelet Transform -> Adaptive Threshold -> Peak Grouping',
    codeSnippet: `def peak_picking(raw_signal, snr_threshold=3.0):
    """
    NTS Peak Picking Implementation v3.2
    """
    # 1. Wavelet Denoising
    coeffs = pywt.wavedec(raw_signal, 'db4', level=6)
    clean_signal = pywt.waverec(coeffs, 'db4')
    
    # 2. Baseline Correction
    baseline = airPLS(clean_signal, lambda_=100)
    corrected = clean_signal - baseline
    
    # 3. Local Maxima Detection
    peaks, _ = find_peaks(corrected, height=snr_threshold * np.std(corrected))
    
    return peaks, corrected`
  },
  { 
    id: '2', name: 'PFAS-Structure-ID', version: '1.0.4', type: 'structure', source: 'paper', accuracy: '92.1%', 
    paperRef: 'Env. Sci. Technol. 2023, 57, 12, "Deep Learning for PFAS"',
    description: '从文献中提取的深度学习模型，专门用于识别含氟化合物的MS/MS碎片特征。',
    modelArch: 'Bi-LSTM (128 units) -> Attention Layer -> Dense (Softmax)',
    codeSnippet: `class PFASIdentifier(nn.Module):
    def __init__(self, vocab_size, embedding_dim):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        # Bidirectional LSTM for spectral sequence
        self.lstm = nn.LSTM(embedding_dim, 128, bidirectional=True)
        self.attention = SelfAttention(256)
        self.fc = nn.Linear(256, num_classes)
        
    def forward(self, ms2_spectrum):
        # ms2_spectrum shape: [batch, peaks, intensity]
        x = self.embedding(ms2_spectrum)
        output, (hidden, cell) = self.lstm(x)
        attn_output = self.attention(output)
        return torch.softmax(self.fc(attn_output), dim=1)`
  },
  { 
    id: '3', name: 'ToxCast-Prediction-Light', version: '2.1.0', type: 'risk', source: 'custom', accuracy: '85.4%',
    description: '轻量级毒性预测模型，基于 EPA ToxCast 数据库训练，适用于移动端快速筛查。',
    modelArch: 'XGBoost Regressor (n_estimators=500)',
    codeSnippet: `import xgboost as xgb

def predict_risk_score(descriptors):
    # Load pre-trained booster
    model = xgb.Booster()
    model.load_model('toxcast_light_v2.json')
    
    dmatrix = xgb.DMatrix(descriptors)
    
    # Predict LC50 (mg/L)
    lc50_pred = model.predict(dmatrix)
    
    # Convert to Risk Score (0-100)
    risk_score = 100 / (1 + np.exp(-(lc50_pred - 0.5)))
    return risk_score`
  },
  { 
    id: '4', name: 'Photo-Degradation-Sim', version: '0.9.5', type: 'prediction', source: 'system', accuracy: '91.0%',
    description: '基于量子化学计算的光解路径模拟器，可预测降解半衰期。',
    modelArch: 'Density Functional Theory (DFT) Integration',
    codeSnippet: `def simulate_photolysis(molecule_smiles, uv_intensity):
    mol = Chem.MolFromSmiles(molecule_smiles)
    
    # Calculate HOMO-LUMO gap via DFT lookup
    gap_energy = dft_database.get_gap(mol)
    
    # Quantum Yield estimation
    phi = 0.05 * np.exp(-gap_energy / 2.5)
    
    # Rate constant k
    k = 2.303 * uv_intensity * phi * extinction_coeff
    
    return {'k': k, 'half_life': 0.693 / k}`
  },
];

const KnowledgeCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'algorithms' | 'paper_extraction'>('algorithms');
  const [selectedAlgo, setSelectedAlgo] = useState<Algorithm>(mockAlgorithms[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedCode, setExtractedCode] = useState<string | null>(null);

  const handleSimulateExtraction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setExtractedCode(`import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

def predict_toxicity(molecular_descriptors):
    """
    Extracted from paper.
    """
    weights = np.load('model_weights_v2.npy') 
    features = [molecular_descriptors['logKow'], molecular_descriptors['MW']]
    toxicity_score = np.dot(features, weights.T)
    return toxicity_score`);
    }, 2500);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 shrink-0">
        <div>
           <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
             <BookOpen className="w-6 h-6 text-blue-400" />
             知识与算法中心
           </h2>
           <p className="text-sm text-slate-400 mt-1">管理核心算法库，或通过 AI 从前沿文献中自动抽取新算法。</p>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
           <button 
             onClick={() => setActiveTab('algorithms')}
             className={`px-4 py-2 text-sm rounded-md transition-all ${activeTab === 'algorithms' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
           >
             算法仓库
           </button>
           <button 
             onClick={() => setActiveTab('paper_extraction')}
             className={`px-4 py-2 text-sm rounded-md transition-all flex items-center gap-2 ${activeTab === 'paper_extraction' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
           >
             <Zap className="w-3.5 h-3.5" /> 文献转算法 (Paper-to-Code)
           </button>
        </div>
      </div>

      {activeTab === 'algorithms' && (
        <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
           {/* Left: List */}
           <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
              {mockAlgorithms.map(algo => (
                 <div 
                   key={algo.id} 
                   onClick={() => setSelectedAlgo(algo)}
                   className={`p-4 rounded-lg border cursor-pointer transition-all ${
                     selectedAlgo.id === algo.id 
                       ? 'bg-blue-900/20 border-blue-500/50 shadow-lg shadow-blue-900/20' 
                       : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-700/50'
                   }`}
                 >
                    <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2">
                          {algo.type === 'screening' && <Cpu className="w-4 h-4 text-purple-400" />}
                          {algo.type === 'structure' && <Layers className="w-4 h-4 text-blue-400" />}
                          {algo.type === 'risk' && <Zap className="w-4 h-4 text-orange-400" />}
                          <span className="font-bold text-slate-200 text-sm">{algo.name}</span>
                       </div>
                       <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">v{algo.version}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">{algo.description}</p>
                    <div className="flex items-center justify-between text-[10px]">
                       <span className={`px-1.5 py-0.5 rounded ${algo.source === 'paper' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-slate-700 text-slate-300'}`}>
                          {algo.source === 'paper' ? '文献提取' : '系统内置'}
                       </span>
                       <span className="text-green-400">Acc: {algo.accuracy}</span>
                    </div>
                 </div>
              ))}
              
              <div className="border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center p-6 text-slate-500 hover:border-slate-500 hover:text-slate-300 transition-colors cursor-pointer min-h-[100px]">
                 <Upload className="w-6 h-6 mb-2" />
                 <span className="text-xs font-medium">导入新算法</span>
              </div>
           </div>

           {/* Right: Detail View */}
           <div className="w-2/3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden">
              <div className="h-12 border-b border-slate-800 bg-slate-800/50 flex items-center justify-between px-4">
                 <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-slate-200">Algorithm Implementation</span>
                 </div>
                 <div className="flex gap-3 text-xs">
                    <button className="flex items-center gap-1 text-slate-400 hover:text-white"><ExternalLink className="w-3 h-3"/> API 文档</button>
                    <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300"><Download className="w-3 h-3"/> 导出 .py</button>
                 </div>
              </div>

              <div className="flex-1 overflow-auto bg-[#0d1117] p-4 font-mono text-xs text-slate-300">
                 {selectedAlgo.paperRef && (
                    <div className="mb-4 p-3 bg-slate-800/50 border border-slate-700 rounded text-slate-400 italic">
                       # Source: {selectedAlgo.paperRef}
                    </div>
                 )}
                 {selectedAlgo.modelArch && (
                    <div className="mb-4 p-3 bg-slate-800/50 border border-slate-700 rounded text-slate-400">
                       # Model Architecture: {selectedAlgo.modelArch}
                    </div>
                 )}
                 <pre className="text-blue-100">
                    <code className="language-python">
                       {selectedAlgo.codeSnippet || '# Code not available'}
                    </code>
                 </pre>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'paper_extraction' && (
        <div className="flex-1 flex gap-6 overflow-hidden">
           {/* Reuse existing Paper Extraction UI */}
           <div className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                 <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                   <FileText className="w-4 h-4 text-slate-400" /> 文献源文件
                 </h3>
                 <button 
                   onClick={handleSimulateExtraction}
                   disabled={isProcessing}
                   className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-blue-500 disabled:opacity-50"
                 >
                   {isProcessing ? <Zap className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                   {isProcessing ? 'AI 分析中...' : '开始提取算法'}
                 </button>
              </div>
              <div className="flex-1 bg-slate-300 relative overflow-hidden group">
                 <div className="p-8 text-slate-800 text-[10px] space-y-4 opacity-70 select-none">
                    <div className="text-xl font-bold text-center text-slate-900 mb-8">Deep Learning for Novel Pollutant Toxicity Prediction</div>
                    <div className="columns-2 gap-4 text-justify">
                       <p className="mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                       <div className="border border-red-500/50 bg-red-500/10 p-1 rounded">
                          <strong className="text-red-800">2. Methodology (Algorithm Description)</strong>
                          <p>The toxicity prediction model utilizes a customized Random Forest Regressor. Feature extraction focuses on molecular weight (MW) and Topological Polar Surface Area (TPSA)...</p>
                       </div>
                    </div>
                 </div>
                 {isProcessing && (
                   <div className="absolute inset-0 bg-blue-500/10 z-10">
                      <div className="w-full h-1 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                   </div>
                 )}
              </div>
           </div>
           <div className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                 <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                   <Code2 className="w-4 h-4 text-green-400" /> 生成的算法代码 (Python)
                 </h3>
              </div>
              <div className="flex-1 p-4 overflow-auto bg-[#0d1117]">
                 {extractedCode ? (
                    <pre className="text-xs font-mono text-slate-300 leading-relaxed"><code className="language-python">{extractedCode}</code></pre>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600">
                       <Cpu className="w-10 h-10 mb-3 opacity-20" />
                       <p className="text-sm">等待分析结果...</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeCenter;