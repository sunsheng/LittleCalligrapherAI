import * as React from 'react';
import { CharacterGrid } from './components/CharacterGrid';
import { StrokeOrderModal } from './components/StrokeOrderModal';
import { GRID_OPTIONS, GridType } from './types';

const { useState } = React;

function App() {
  const [text, setText] = useState("好好学习天天向上");
  const [gridType, setGridType] = useState<GridType>('mi');
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  // Parse text into individual characters (filtering out basic whitespace)
  const characters = text.split('').filter(c => c.trim() !== '' || c === '　');

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-700 pb-12 print:pb-0">
      
      {/* Header */}
      <header className="bg-red-600 text-amber-50 shadow-md print:hidden">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✍️</span>
            <div>
              <h1 className="text-2xl font-bold font-handwriting tracking-wider">小小书法家</h1>
              <p className="text-red-100 text-xs opacity-90">小学生练字助手</p>
            </div>
          </div>
          <button 
            onClick={() => window.print()} 
            className="bg-amber-100 text-red-700 px-4 py-2 rounded-full font-bold hover:bg-white transition-colors flex items-center gap-2 text-sm shadow-sm"
          >
            🖨️ 打印字帖
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-grow flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Controls - Hidden in Print */}
        <aside className="w-full md:w-80 flex-shrink-0 space-y-6 print:hidden">
          
          {/* Manual Input */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-100">
            <h2 className="font-bold text-lg mb-3 text-slate-700">✏️ 练字内容</h2>
            <textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              className="w-full h-32 border border-slate-200 rounded-lg p-3 text-lg font-kaiti resize-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none bg-white text-slate-900 placeholder:text-slate-400"
              placeholder="在这里输入想要练习的汉字..."
            />
            <p className="text-xs text-slate-400 mt-2 text-right">已输入 {characters.length} 个字</p>
          </div>

          {/* Settings */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-100 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">格线样式</label>
              <div className="grid grid-cols-2 gap-2">
                {GRID_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setGridType(opt.value)}
                    className={`py-2 text-sm rounded-lg border transition-all ${gridType === opt.value ? 'bg-red-50 border-red-300 text-red-700 font-medium' : 'bg-white border-slate-200 text-slate-600 hover:border-red-200'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-600 leading-relaxed">
              💡 提示：点击右侧字帖