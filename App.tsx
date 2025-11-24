import React, { useState } from 'react';
import { CharacterGrid } from './components/CharacterGrid';
import { StrokeOrderModal } from './components/StrokeOrderModal';
import { GRID_OPTIONS, GridType, PRESET_TOPICS } from './types';
import { generatePracticeText } from './services/gemini';

function App() {
  const [text, setText] = useState("好好学习天天向上");
  const [gridType, setGridType] = useState<GridType>('mi');
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [topic, setTopic] = useState(PRESET_TOPICS[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Parse text into individual characters (filtering out basic whitespace)
  const characters = text.split('').filter(c => c.trim() !== '' || c === '　');

  const handleGenerate = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const generatedText = await generatePracticeText(topic);
      if (generatedText) {
        setText(generatedText);
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      alert(error.message || "AI 生成失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-700 pb-12 print:pb-0">
      
      {/* Header */}
      <header className="bg-red-600 text-amber-50 shadow-md print:hidden sticky top-0 z-40">
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
            <h2 className="font-bold text-lg mb-3 text-slate-700 flex items-center gap-2">
              <span>✏️</span> 练字内容
            </h2>
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
            
            <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-600 leading-relaxed flex gap-2 border border-blue-100">
              <span className="text-lg">💡</span>
              <span className="pt-0.5">提示：点击右侧字帖中的汉字，可以查看笔画顺序动画并进行跟写练习哦！</span>
            </div>
          </div>

          {/* AI Generator */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl shadow-sm border border-indigo-100">
            <div className="flex items-center gap-2 mb-3">
               <span className="text-xl">✨</span>
               <h2 className="font-bold text-lg text-indigo-900">AI 智能出题</h2>
            </div>
            <p className="text-xs text-indigo-600/80 mb-4">不知道练什么？让 AI 帮你出题！</p>
            
            <div className="space-y-3">
              <select 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2 rounded-lg border border-indigo-200 bg-white text-sm text-indigo-900 focus:ring-2 focus:ring-indigo-200 outline-none cursor-pointer"
              >
                {PRESET_TOPICS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full py-2.5 rounded-lg font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all ${
                  isLoading 
                    ? 'bg-indigo-300 text-white cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    生成中...
                  </>
                ) : (
                  '生成练习内容'
                )}
              </button>
            </div>
          </div>

        </aside>

        {/* Main Content - Paper Area */}
        <div className="flex-grow">
          <div className="bg-white shadow-lg print:shadow-none min-h-[800px] p-8 md:p-12 rounded-2xl relative overflow-hidden print:p-0 print:overflow-visible">
             {/* Paper Texture/Background for screen only */}
             <div className="absolute inset-0 bg-[#fdfbf7] opacity-100 pointer-events-none print:hidden -z-10"></div>
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 pointer-events-none print:hidden -z-10"></div>
             
             {/* Paper Header (Print Only) */}
             <div className="hidden print:block text-center mb-8 border-b-2 border-red-800/20 pb-4 pt-4">
                <h1 className="text-3xl font-kaiti font-bold text-slate-800 mb-2">汉字书写练习</h1>
                <div className="flex justify-between text-sm text-slate-500 mt-4 px-8">
                   <span>班级：__________</span>
                   <span>姓名：__________</span>
                   <span>日期：__________</span>
                   <span>评分：__________</span>
                </div>
             </div>

             {/* Grid Container */}
             {characters.length > 0 ? (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 print:grid-cols-6 print:gap-x-2 print:gap-y-4">
                  {characters.map((char, index) => (
                    <CharacterGrid 
                      key={`${char}-${index}`}
                      char={char}
                      gridType={gridType}
                      onShowStrokeOrder={setSelectedChar}
                    />
                  ))}
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                 <span className="text-6xl mb-4">📝</span>
                 <p className="text-xl">请输入文字开始练习</p>
               </div>
             )}
          </div>
          
          <div className="text-center mt-6 text-slate-400 text-sm print:hidden">
             Designed for A4 Paper Printing &bull; Interactive Stroke Order &bull; AI Content
          </div>
        </div>

      </main>

      {/* Modals */}
      {selectedChar && (
        <StrokeOrderModal 
          char={selectedChar} 
          onClose={() => setSelectedChar(null)} 
        />
      )}
    </div>
  );
}

export default App;
