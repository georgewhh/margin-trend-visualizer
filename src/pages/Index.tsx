
import React from 'react';
import MarginRatioChart from '@/components/MarginRatioChart';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#1A1F2C]">
      <header className="w-full bg-[#222232]/50 border-b border-white/10 shadow-sm py-4">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-semibold text-white/90">市场趋势分析</h1>
        </div>
      </header>
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 animate-slide-up">
        <div className="bg-[#222232]/30 border border-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md">
          <MarginRatioChart />
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>根据时间轴拖动范围可查看不同时间段的两融余额占流通市值比数据</p>
        </div>
      </main>
      
      <footer className="bg-[#222232]/50 border-t border-white/10 py-6">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} 两融余额占比分析工具</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
