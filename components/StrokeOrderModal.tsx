import * as React from 'react';
import HanziWriter from 'hanzi-writer';

interface StrokeOrderModalProps {
  char: string;
  onClose: () => void;
}

export const StrokeOrderModal: React.FC<StrokeOrderModalProps> = ({ char, onClose }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const writerRef = React.useRef<any>(null);
  const totalStrokesRef = React.useRef<number>(0);
  const [status, setStatus] = React.useState<string>('准备演示...');

  // Helper to start the quiz mode
  const startQuiz = () => {
    const writer = writerRef.current;
    if (!writer) return;

    setStatus('该你了！请在方格内描红');
    
    // Reset visual state for quiz
    writer.hideCharacter();
    writer.showOutline();
    
    writer.quiz({
      onMistake: function(strokeData: any) {
        setStatus('笔画顺序不对哦，再试一次 😅');
      },
      onCorrectStroke: function(strokeData: any) {
        // strokeData.strokeNum is 0-indexed
        setStatus(`正确！(${strokeData.strokeNum + 1}/${totalStrokesRef.current}) 👍`);
      },
      onComplete: function(summaryData: any) {
        setStatus('太棒了！挑战成功 🎉');
        // Do NOT restart animation here per requirements
      }
    });
  };

  // Main flow: Animate -> Then Quiz
  const startSequence = () => {
    const writer = writerRef.current;
    if (!writer) return;

    // Ensure clean state
    try {
        writer.cancelQuiz();
    } catch(e) {}
    
    setStatus('正在演示笔画顺序...');
    writer.showCharacter();
    
    writer.animateCharacter({
      onComplete: () => {
        // Wait a beat then start quiz
        setTimeout(() => {
            startQuiz();
        }, 800);
      }
    });
  };

  React.useEffect(() => {
    if (containerRef.current) {
      // Initialize writer
      // Cast options to any to allow onLoadCharData which might be missing in type definitions
      const writer = HanziWriter.create(containerRef.current, char, {
        width: 260,
        height: 260,
        padding: 20,
        showOutline: true,
        strokeAnimationSpeed: 1, // standard speed
        delayBetweenStrokes: 200,
        drawingWidth: 40, // Increased from default (20) to 40 for thicker strokes
        strokeColor: '#333', // Dark color for the "ink"
        outlineColor: '#d4d4d8', // Light gray for the outline
        onLoadCharData: (charData: any) => {
            totalStrokesRef.current = charData.strokes.length;
        }
      } as any);
      
      writerRef.current = writer;

      // Start the sequence once loaded (though create is sync, loading is async?)
      // animateCharacter handles the async load wait internally
      startSequence();
    }

    return () => {
        if (writerRef.current) {
            try {
                writerRef.current.cancelQuiz();
            } catch(e) {}
        }
    };
  }, [char]);

  const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
          onClose();
      }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col animate-pop-in">
        {/* Header */}
        <div className="bg-indigo-600 px-4 py-3 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <span>📝</span> 笔顺演示与练习
          </h3>
          <button 
            onClick={onClose}
            className="text-indigo-100 hover:text-white hover:bg-indigo-500/50 rounded-full p-1 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Canvas Container */}
        <div className="p-6 flex flex-col items-center gap-4 bg-slate-50">
          <div className="relative bg-white rounded-xl shadow-inner border border-slate-200">
              {/* Custom Grid Background behind canvas */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                  <line x1="0" y1="0" x2="100" y2="100" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="4 2" />
                  <line x1="100" y1="0" x2="0" y2="100" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="4 2" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="4 2" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="4 2" />
              </svg>
              <div ref={containerRef} className="cursor-crosshair touch-none" />
          </div>
          
          <div className="text-center space-y-1">
            <p className={`text-lg font-bold ${status.includes('成功') ? 'text-green-600' : status.includes('不对') ? 'text-orange-500' : 'text-indigo-600'}`}>
                {status}
            </p>
            <p className="text-xs text-slate-400">
                {status.includes('演示') ? '请仔细观察笔顺' : '请跟随红色轮廓书写'}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-white">
           <button 
             onClick={startSequence}
             className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             重置演示
           </button>
           
           <button 
              onClick={onClose}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
           >
             完成
           </button>
        </div>
      </div>
    </div>
  );
};