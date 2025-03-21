
import React from 'react';
import MarginRatioChart from '@/components/MarginRatioChart';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full bg-white border-b border-gray-100 shadow-sm py-4">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-semibold text-gray-900">市场趋势分析</h1>
        </div>
      </header>
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 animate-slide-up">
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <MarginRatioChart />
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>根据时间轴拖动范围可查看不同时间段的两融余额占流通市值比数据</p>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} 两融余额占比分析工具</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
