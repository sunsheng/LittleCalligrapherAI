import * as React from 'react';
import { GridType } from '../types';
import { GridBackground } from './GridBackground';

interface CharacterGridProps {
  char: string;
  gridType: GridType;
  onShowStrokeOrder?: (char: string) => void;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({ 
  char, 
  gridType, 
  onShowStrokeOrder
}) => {
  const handleContainerClick = () => {
    if (onShowStrokeOrder && char.trim()) {
      onShowStrokeOrder(char);
    }
  };

  return (
    <div 
      className="relative aspect-square w-full max-w-[140px] mx-auto bg-white shadow-sm select-none break-inside-avoid group print:shadow-none print:border-none cursor-pointer hover:ring-4 hover:ring-indigo-100 transition-all rounded-sm"
      onClick={handleContainerClick}
      title="点击练习描红"
    >
      {/* Grid Background */}
      <GridBackground type={gridType} />
      
      {/* Character Display */}
      {/* Added font-bold to thicken the strokes */}
      <div className="absolute inset-0 flex items-center justify-center font-kaiti font-bold text-[6rem] leading-none pointer-events-none text-gray-800">
        {char}
      </div>
      
      {/* Interactive Hint (Hover effect only) */}
      <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors duration-300 print:hidden flex items-end justify-center pb-2">
         <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 font-medium bg-white/80 px-2 py-0.5 rounded-full">点击练习</span>
      </div>
    </div>
  );
};